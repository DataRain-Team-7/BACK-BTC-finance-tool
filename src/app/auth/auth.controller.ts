import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './service/auth.service';
import { LoginResponse } from './protocols/login-response';
import { LoginDto } from './service/dto/login.dto';
import { FirstAccessDto } from './service/dto/first-access.dto';
import { PasswordRecoveryDto } from './service/dto/password-recovery.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'The user will be logged',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(dto);
  }

  @ApiOperation({
    summary: 'The user will be logged and your password changed',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('first-access/:token')
  async firstAccess(
    @Param('token') token: string,
    @Body() dto: FirstAccessDto,
  ): Promise<LoginResponse> {
    return await this.authService.firstAccess(token, dto);
  }

  @ApiOperation({
    summary: 'The user will be logged and your password changed',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('/password-recovery/:token')
  async passwordRecovery(
    @Param('token') token: string,
    @Body() dto: PasswordRecoveryDto,
  ): Promise<LoginResponse> {
    return await this.authService.passwordRecovery(token, dto);
  }
}
