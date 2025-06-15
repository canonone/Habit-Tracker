import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import User from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers:[UserService],
  exports:[UserService]
})
export default class UserModule {}
