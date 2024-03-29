import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { AlternativeTeamEntity } from '../entities/alternative-team.entity';
import { AlternativeEntity } from '../entities/alternative.entity';
import { DbCreateAlternativeProps } from '../protocols/props/db-create-alternative.props';
import { DbCreateAlternativesTeamsProps } from '../protocols/props/db-create-alternatives-teams.props';
import { UpdateAlternativeDto } from '../service/dto/update-alternative.dto';

@Injectable()
export class AlternativeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAlternative(
    props: DbCreateAlternativeProps,
  ): Promise<AlternativeEntity> {
    const alternative: Prisma.AlternativesCreateInput = {
      id: props.id,
      description: props.description,
      question: {
        connect: {
          id: props.questionId,
        },
      },
    };

    const alternativeCreated = await this.prisma.alternatives
      .create({ data: alternative })
      .catch(serverError);

    return alternativeCreated;
  }

  async createAlternativesTeams(
    props: DbCreateAlternativesTeamsProps[],
  ): Promise<void> {
    const data: Prisma.Enumerable<Prisma.AlternativesTeamsCreateManyInput> =
      props.map((item) => ({ ...item }));

    await this.prisma.alternativesTeams
      .createMany({ data, skipDuplicates: true })
      .catch(serverError);
  }

  async findAlternativeById(id: string): Promise<AlternativeEntity> {
    const alternativeOrNull = await this.prisma.alternatives
      .findUnique({ where: { id } })
      .catch(serverError);
    return alternativeOrNull;
  }

  async findAlternativeAndTheirTeams(id: string) {
    const alternativeOrNull = await this.prisma.alternatives
      .findUnique({
        where: { id },
        select: {
          id: true,
          description: true,
          teams: {
            select: {
              workHours: true,
              team: {
                select: {
                  id: true,
                  name: true,
                  valuePerHour: true,
                },
              },
            },
          },
        },
      })
      .catch(serverError);
    return alternativeOrNull;
  }

  async findAlternativeTeamByIds(
    alternativeId: string,
    teamId: string,
  ): Promise<AlternativeTeamEntity> {
    const alternativeTeamOrNull = await this.prisma.alternativesTeams
      .findUnique({
        where: {
          alternativeId_teamId: {
            alternativeId,
            teamId,
          },
        },
      })
      .catch(serverError);

    return alternativeTeamOrNull;
  }

  async updateAlternativeById(
    id: string,
    dto: UpdateAlternativeDto,
  ): Promise<AlternativeEntity> {
    const alternativeUpdated = await this.prisma.alternatives
      .update({
        where: { id },
        data: { description: dto.description },
      })
      .catch(serverError);
    return alternativeUpdated;
  }

  async updateAlternativesTeams(
    props: DbCreateAlternativesTeamsProps,
  ): Promise<void> {
    const data: Prisma.AlternativesTeamsUpdateInput = {
      workHours: props.workHours,
    };

    await this.prisma.alternativesTeams
      .update({
        where: {
          alternativeId_teamId: {
            alternativeId: props.alternativeId,
            teamId: props.teamId,
          },
        },
        data,
      })
      .catch(serverError);
  }

  async deleteAlternativeById(id: string): Promise<void> {
    await this.prisma.alternatives.delete({ where: { id } }).catch(serverError);
  }

  async deleteAlternativeTeamByIds(
    alternativeId: string,
    teamId: string,
  ): Promise<void> {
    await this.prisma.alternativesTeams
      .delete({
        where: {
          alternativeId_teamId: {
            alternativeId,
            teamId,
          },
        },
      })
      .catch(serverError);
  }
}
