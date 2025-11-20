import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointments.entity';
import { User } from '../entities/user.entity';
import { CreateAppointmentDto } from './dto/register.dto';
import { UpdateAppointmentDto } from './dto/edit.dto';

type RequestUser = {
  sub: string;
  roles?: string[];
};

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(
    userId: string,
    dto: CreateAppointmentDto,
    requester: RequestUser,
  ) {
    this.assertAccess(requester, userId);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const appointment = this.appointmentRepo.create({
      doctorId: dto.doctorId,
      datetime: new Date(dto.scheduledAt),
      status: dto.status ?? 'pending',
      user,
    });
    return this.appointmentRepo.save(appointment);
  }

  async listByUser(userId: string, requester: RequestUser) {
    this.assertAccess(requester, userId);
    return this.appointmentRepo.find({
      where: { user: { id: userId } },
      order: { datetime: 'ASC' },
    });
  }

  async findOne(id: string, requester: RequestUser) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }
    this.assertAccess(requester, appointment.user.id);
    return appointment;
  }

  async update(
    id: string,
    dto: UpdateAppointmentDto,
    requester: RequestUser,
  ) {
    const appointment = await this.findOne(id, requester);
    if (dto.doctorId !== undefined) {
      appointment.doctorId = dto.doctorId;
    }
    if (dto.scheduledAt !== undefined) {
      appointment.datetime = new Date(dto.scheduledAt);
    }
    if (dto.status !== undefined) {
      appointment.status = dto.status;
    }

  }

  async remove(id: string, requester: RequestUser) {
    const appointment = await this.findOne(id, requester);
    await this.appointmentRepo.remove(appointment);
    return { message: 'Cita eliminada' };
  }

  private assertAccess(requester: RequestUser, ownerId: string) {
    if (!requester) {
      throw new ForbiddenException('No autorizado');
    }
    const isAdmin = requester.roles?.includes('admin');
    if (isAdmin || requester.sub === ownerId) {
      return;
    }
    throw new ForbiddenException('No autorizado');
  }
}
