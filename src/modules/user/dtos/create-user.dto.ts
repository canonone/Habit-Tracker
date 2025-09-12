import { IsBoolean, IsEmail, IsString } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
