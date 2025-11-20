import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'scheduledAt debe ser una fecha válida' })
  scheduledAt?: string;

  @IsOptional()
  @IsIn(['pending', 'done', 'cancelled'], {
    message: 'status debe ser pending, done o cancelled',
  })
  status?: 'pending' | 'done' | 'cancelled';

  @IsOptional()
  @IsString()
  notes?: string;
}
