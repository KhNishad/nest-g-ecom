import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import {
    CreateUserDto

} from './dto/userCreate.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('register')
    register(@Body() body: CreateUserDto) {
        return this.userService.userRegister(body);
    }

    @Get('view/:id')
    viewSingleUser(@Param('id') id: string) {
        return this.userService.getSingleUser(id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    viewProfile(@Request() req) {
        return this.userService.getProfile(req.user.id)
    }



}
