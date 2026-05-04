import { AuthService } from './../auth/auth.service';
import { CustomersService } from './customers.service';
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';
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
    getCustomerList(@Query() query: { page: string; limit: string; search?: string }) {
        return this.customerService.getCustomers(query)
    }

    @Post('/login')
    login(@Body() body: LoginDto) {
        return this.authService.customerLogin(body)
    }

    @Post('/send-otp')
    sendOtp(@Body() phone: { phone: string }) {
        return this.authService.sendOtp(phone.phone)
    }

    @Post('/login/otp')
    otpLogin(@Body() body: { phone: string; otp: string }) {
        return this.authService.customerOtpLogin(body.phone, body.otp)
    }

    @Patch('/update-self')
    @UseGuards(AuthGuard('jwt'))
    updateProfile(@Body() body: UpdateCustomerDto, @Req() req:any) {
        console.log(req.user)
        return this.customerService.updateCustomer(body,req.user.id)
    }




}
