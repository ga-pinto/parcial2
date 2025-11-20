import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  ArrayUnique,
} from 'class-validator';

export class AssignRolesDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'roles inválidos' })
  @ArrayUnique()
  @IsString({ each: true })
  roles: string[];
}
