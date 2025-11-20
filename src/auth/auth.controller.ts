import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto); // Retorna el usuario registrado 201
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Cambiado a 200 OK
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

}
