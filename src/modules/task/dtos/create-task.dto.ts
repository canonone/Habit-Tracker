import { IsString, IsBoolean } from 'class-validator';

export default class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
