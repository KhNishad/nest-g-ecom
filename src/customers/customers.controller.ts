import { AuthService } from './../auth/auth.service';
import { CustomersService } from './customers.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from 'src/auth/dto/auth.dto';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customerService: CustomersService, private readonly authService: AuthService) { }


    @Post('/customer-registration')
    customerRegistration(@Body() body: CreateCustomerDto) {
        return this.customerService.customerRegister(body)
    }

    @Get('/customer-list')
    @UseGuards(AuthGuard('jwt'))
    getCustomerList() {
        return this.customerService.getCustomers()
    }

    @Post('/login')
    login(@Body() body: LoginDto) {

        return this.authService.customerLogin(body)
    }



}
