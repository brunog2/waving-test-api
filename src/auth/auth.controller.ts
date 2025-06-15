import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/auth/login.dto';
import { CreateUserDto } from 'src/dto/auth/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/login')
  async customerLogin(@Body() loginDto: LoginDto) {
    return this.authService.customerLogin(loginDto);
  }

  @Post('customer/register')
  async customerRegister(@Body() registerDto: CreateUserDto) {
    return this.authService.customerRegister(registerDto);
  }

  @Post('admin/login')
  async adminLogin(@Body() loginDto: any) {
    return this.authService.adminLogin(loginDto);
  }
}
