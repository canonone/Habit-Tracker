import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import CreateUserDto from './dtos/create-user.dto';
import UpdateUSerDto from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(body: CreateUserDto) {
    // const { email, password } = body;
    const user = this.repo.create(body);
    return this.repo.save(user);
  }

  async findById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email } });
    return user;
  }

  findAll() {
    return this.repo.find();
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    return this.repo.delete(id);
  }

  async updateUser(id: string, body: UpdateUSerDto) {
    const user = await this.repo.preload({
      id,
      ...body,
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    return this.repo.save(user);
  }
}
