import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import {
    CreateUserDto

} from './dto/userCreate.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('register')
    register(@Body() body: CreateUserDto) {
        return this.userService.userRegister(body);
    }

    @Get('/user-list')
    getUserList (){
        return 'i am the list'
    }
}
