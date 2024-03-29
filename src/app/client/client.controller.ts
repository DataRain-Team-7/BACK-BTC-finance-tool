import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateClienteResponse } from './protocols/create-client-response';
import { FindAllClientsResponse } from './protocols/find-all-clients-response';
import { FindClientByIdResponse } from './protocols/find-client-by-id-response';
import { ClientService } from './service/client.service';
import { CreateClientDto } from './service/dto/create-client.dto';
import { UpdateClientDto } from './service/dto/update-client.dto';

@Controller('client')
@ApiTags('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a client',
  })
  async createClient(
    @Body() dto: CreateClientDto,
  ): Promise<CreateClienteResponse> {
    return await this.clientService.createClient(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all clients',
  })
  async findAllClients(): Promise<FindAllClientsResponse[]> {
    return await this.clientService.findAllClients();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find client by id',
  })
  async findClientById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<FindClientByIdResponse> {
    return await this.clientService.findClientById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update client by id',
  })
  async updateClientById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<void> {
    return await this.clientService.updateClientById(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete client by id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteClientById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return await this.clientService.deleteClientById(id);
  }
}
