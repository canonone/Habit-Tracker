import { IsBoolean, IsEmail, IsString } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

}
