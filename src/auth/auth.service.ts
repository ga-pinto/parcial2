import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (!dto.email) {
      throw new BadRequestException('Email inválido');
    }
    const roles =
      dto.roles && dto.roles.length > 0
        ? await this.rolesService.findByNames(dto.roles)
        : [];
    if (dto.roles && roles.length !== dto.roles.length) {
      throw new BadRequestException('roles inválidos');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashed,
      name: dto.name,
      phone: dto.phone ?? null,
      roles,
    });
    return { message: 'Usuario registrado con éxito', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    if (!user.is_active) {
      throw new HttpException('Usuario desactivado', HttpStatus.LOCKED);
    }
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((r) => r.role_name) ?? [],
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
