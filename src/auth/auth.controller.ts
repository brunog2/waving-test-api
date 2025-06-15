import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/login')
  async customerLogin(@Body() loginDto: any) {
    return this.authService.customerLogin(loginDto);
  }

  @Post('customer/register')
  async customerRegister(@Body() registerDto: any) {
    return this.authService.customerRegister(registerDto);
  }

  @Post('admin/login')
  async adminLogin(@Body() loginDto: any) {
    return this.authService.adminLogin(loginDto);
  }
}
