import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('customer/login')
  async customerLogin(@Body() loginDto: LoginDto) {
    return this.authService.customerLogin(loginDto);
  }

  @Post('customer/register')
  async customerRegister(@Body() registerDto: CreateUserDto) {
    return this.authService.customerRegister(registerDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('admin/login')
  async adminLogin(@Body() loginDto: any) {
    return this.authService.adminLogin(loginDto);
  }
}
