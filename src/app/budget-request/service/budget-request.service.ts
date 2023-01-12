import { BadRequestException, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { AlternativeService } from 'src/app/alternatives/service/alternative.service';
import { ClientService } from 'src/app/client/service/client.service';
import { QuestionService } from 'src/app/question/service/question.service';
import { checkHasDuplicates } from 'src/app/util/check-has-duplicates-in-array';
import { createUuid } from 'src/app/util/create-uuid';
import { DbCreateClientResponsesProps } from '../protocols/props/db-create-client-responses.props';
import { BudgetRequestRepository } from '../repositories/budget-request.repository';
import {
  BudgetRequest,
  CreateBudgetRequestDto,
} from './dto/create-budget-request.dto';

@Injectable()
export class BudgetRequestService {
  constructor(
    private readonly budgetRequestRepository: BudgetRequestRepository,
    private readonly clientService: ClientService,
    private readonly questionService: QuestionService,
    private readonly alternativeService: AlternativeService,
  ) {}

  async createBudgetRequest(dto: CreateBudgetRequestDto) {
    const responses: BudgetRequest[] = dto.responses;
    const questionIds = responses.map((response) => response.questionId);
    const alternativeIds = responses.map((response) => response.alternativeId);
    checkHasDuplicates(questionIds, `Question Id cannot be duplicated`);
    checkHasDuplicates(alternativeIds, `Alternative Id cannot be duplicated`);

    await this.clientService.verifyClientExist(dto.clientId);

    for (const response of responses) {
      if (!response.alternativeId && !response.responseDetails) {
        throw new BadRequestException(`Altarnative id or details required`);
      }
      await this.questionService.veryfiQuestionExist(response.questionId);
      await this.questionService.verifyRelationshipBetweenQuestionAndAlternative(
        {
          questionId: response.questionId,
          alternativeId: response.alternativeId,
        },
      );
    }

    let amount = 0;
    let totalHours = 0;
    for (const response of responses) {
      if (response.alternativeId) {
        const alternative =
          await this.alternativeService.findAlternativeAndTheirTeams(
            response.alternativeId,
          );

        if (alternative.teams.length > 0) {
          alternative.teams.forEach((team) => {
            amount += team.workHours * team.team.valuePerHour;
            totalHours += team.workHours;
          });
        }
      }
    }

    const budgetRequestCreated =
      await this.budgetRequestRepository.createBudgetRequest({
        id: createUuid(),
        clientId: dto.clientId,
        status: Status.request,
        amount: Number(amount.toFixed(2)),
        totalHours: totalHours,
      });

    const data: DbCreateClientResponsesProps[] = responses.map((response) => ({
      ...response,
      id: createUuid(),
      budgetRequestId: budgetRequestCreated.id,
    }));

    return await this.budgetRequestRepository.createClientResponses(data);
  }
}