import { Injectable } from '@nestjs/common';
import { createUuid } from 'src/app/util/create-uuid';
import { CreateClienteResponse } from '../protocols/create-client-response';
import { DbCreateClientResponsesProps } from '../protocols/props/db-create-client-responses.props';
import { ClientRepository } from '../repositories/client.repository';
import { ClientResponsesDto } from './dto/client-responses.dto';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async createClient(dto: CreateClientDto): Promise<CreateClienteResponse> {
    dto.name = dto.name.trim();
    dto.companyName = dto.companyName.toLowerCase().trim();
    dto.phone = dto.phone.replace(/\s/g, '').replace(/[^0-9]/g, '');

    const clientOrNull = await this.clientRepository.findClientByCompanyName(
      dto.companyName,
    );

    if (clientOrNull) {
      return {
        id: clientOrNull.id,
        companyName: clientOrNull.companyName,
      };
    }

    const clientCreated = await this.clientRepository.createClient({
      ...dto,
      id: createUuid(),
    });
    return {
      id: clientCreated.id,
      companyName: clientCreated.companyName,
    };
  }

  async createClientResponses(dto: ClientResponsesDto) {
    const dtoWithId: DbCreateClientResponsesProps[] = dto.responses.map(
      (response) => ({
        ...response,
        id: createUuid(),
      }),
    );

    return await this.clientRepository.createClientResponses(dtoWithId);
  }
}
