import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateOwnUserDto {
  @IsOptional()
  @Length(2, 70)
  @IsString()
  @ApiProperty({
    description: 'The first name of the User',
    example: 'Lucas',
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @Length(3, 100)
  @ApiProperty({
    description: 'The email of the User',
    example: 'email@mail.com',
  })
  email?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Current password of User',
    example: 'Abcd@1234',
  })
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @Length(8, 50)
  @ApiProperty({
    description: 'The new password of the User',
    example: 'Abcd@1234',
  })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User new password confirmation',
    example: 'Abcd@1234',
  })
  confirmPassword?: string;
}
