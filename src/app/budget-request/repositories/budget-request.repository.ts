import { Injectable } from '@nestjs/common';
import { Prisma, Status } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { BudgetRequestEntity } from '../entities/budget-request.entity';
import { DbFindAllBudgetRequestsResponse } from '../protocols/db-find-all-budget-requests.response';
import { DbAprrovedByPreSaleBudgetRequestProps } from '../protocols/props/db-approved-budget-request.props';
import { DbCreateBudgetRequestProps } from '../protocols/props/db-create-budget-request.props';
import { DbCreateClientResponsesProps } from '../protocols/props/db-create-client-responses.props';
import { DbUpdateBudgetRequestProps } from '../protocols/props/db-update-budget-request.props';
import { DbUpdateClientResponseProps } from '../protocols/props/db-update-client-response.props';

@Injectable()
export class BudgetRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBudgetRequest(
    props: DbCreateBudgetRequestProps,
  ): Promise<BudgetRequestEntity> {
    const data: Prisma.BudgetRequestCreateInput = {
      id: props.id,
      status: props.status,
      amount: props.amount,
      totalHours: props.totalHours,
      client: {
        connect: {
          id: props.clientId,
        },
      },
    };
    const budgetRequestCreated = await this.prisma.budgetRequest
      .create({
        data,
      })
      .catch(serverError);

    return budgetRequestCreated;
  }

  async createClientResponses(
    props: DbCreateClientResponsesProps[],
  ): Promise<void> {
    const data: Prisma.Enumerable<Prisma.ClientsResponsesCreateManyInput> =
      props.map((response) => ({ ...response }));
    await this.prisma.clientsResponses.createMany({ data }).catch(serverError);
  }

  async findBudgetRequestById(id: string): Promise<BudgetRequestEntity> {
    const budgetRequestOrNull = await this.prisma.budgetRequest
      .findUnique({
        where: { id },
      })
      .catch(serverError);
    return budgetRequestOrNull;
  }

  async findBudgetRequestByIdWithClient(id: string) {
    const budgetRequestOrNull = await this.prisma.budgetRequest
      .findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          amount: true,
          totalHours: true,
          createdAt: true,
          updatedAt: true,
          notes: true,
          client: {
            select: {
              id: true,
              companyName: true,
              primaryContactName: true,
              phone: true,
              email: true,
            },
          },
          clientsResponses: {
            where: {
              budgetRequestId: id,
            },
            select: {
              id: true,
              responseDetails: true,
              valuePerHour: true,
              workHours: true,
              question: {
                select: {
                  id: true,
                  description: true,
                },
              },
              alternative: {
                select: {
                  id: true,
                  description: true,
                  teams: {
                    select: {
                      team: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
      .catch(serverError);
    return budgetRequestOrNull;
  }

  async findAllBudgetRequests(
    status?: Status,
  ): Promise<DbFindAllBudgetRequestsResponse[]> {
    const budgetRequestsOrEmpty = await this.prisma.budgetRequest
      .findMany({
        where: { status: { equals: status } },
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          client: {
            select: {
              id: true,
              companyName: true,
              primaryContactName: true,
            },
          },
        },
        orderBy: {
          status: 'asc',
        },
      })
      .catch(serverError);
    return budgetRequestsOrEmpty;
  }

  async aprrovedBudgetRequest(
    id: string,
    props: DbAprrovedByPreSaleBudgetRequestProps,
  ): Promise<void> {
    const data: Prisma.BudgetRequestUpdateInput = {
      ...props,
    };
    await this.prisma.budgetRequest
      .update({
        where: { id },
        data,
      })
      .catch(serverError);
  }

  async updateClientResponse(
    props: DbUpdateClientResponseProps,
  ): Promise<void> {
    await this.prisma.clientsResponses
      .update({
        where: { id: props.id },
        data: {
          valuePerHour: props.valuePerHour,
          workHours: props.workHours,
        },
      })
      .catch(serverError);
  }

  async updateBudgetRequest(props: DbUpdateBudgetRequestProps) {
    await this.prisma.budgetRequest.update({
      where: { id: props.id },
      data: {
        amount: props.amount,
        totalHours: props.totalHours,
      },
    });
  }

  async findClientResponses(id: string) {
    const clientResponsesOrNull = await this.prisma.clientsResponses
      .findUnique({
        where: { id },
      })
      .catch(serverError);
    return clientResponsesOrNull;
  }

  async deleteBudgetRequestById(id: string): Promise<void> {
    await this.prisma.budgetRequest
      .delete({ where: { id } })
      .catch(serverError);
  }
}
