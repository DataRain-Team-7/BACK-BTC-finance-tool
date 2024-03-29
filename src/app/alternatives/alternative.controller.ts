import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAlternativeResponse } from './protocols/create-alternative-response';
import { AlternativeService } from './service/alternative.service';
import { CreateAlternativeDto } from './service/dto/create-alternative.dto';
import { UpdateAlternativeDto } from './service/dto/update-alternative.dto';

@Controller('alternative')
@ApiTags('alternative')
export class AlternativeController {
  constructor(private readonly alternativeService: AlternativeService) {}

  @Post()
  @ApiOperation({
    summary: 'Alternative is create',
  })
  async createAlternative(
    @Body() dto: CreateAlternativeDto,
  ): Promise<CreateAlternativeResponse> {
    return await this.alternativeService.createAlternative(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update alternative by id',
  })
  async updateAlternativeById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAlternativeDto,
  ): Promise<void> {
    return await this.alternativeService.updateAlternative(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete alternative by id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlternativeById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return await this.alternativeService.deleteAlternativeById(id);
  }

  @Delete(':alternativeId/:teamId')
  @ApiOperation({
    summary: 'Delete the relationship between alternative and team',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlternativeTeamByIds(
    @Param('alternativeId', new ParseUUIDPipe()) alternativeId: string,
    @Param('teamId', new ParseUUIDPipe()) teamId: string,
  ): Promise<void> {
    return await this.alternativeService.deleteAlternativeTeamByIds(
      alternativeId,
      teamId,
    );
  }
}
