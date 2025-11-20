import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/register.dto';
import { UpdateAppointmentDto } from './dto/edit.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
//usar el userID /appointments / id appointments
  @Post('users/:userId/appointments')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateAppointmentDto,
    @Request() req: any,
  ) {
    return this.appointmentsService.create(userId, dto, req.user);
  }

  @Get('users/:userId/appointments')
  list(
    @Param('userId') userId: string,
    @Request() req: any,
  ) {
    return this.appointmentsService.listByUser(userId, req.user);
  }

  @Get('appointments/:id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.findOne(id, req.user);
  }

  @Patch('appointments/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
    @Request() req: any,
  ) {
    return this.appointmentsService.update(id, dto, req.user);
  }

  @Delete('appointments/:id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.remove(id, req.user);
  }
}
