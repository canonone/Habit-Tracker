import { Controller, Get, Put, Param, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import UpdateUSerDto from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUSerDto) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
