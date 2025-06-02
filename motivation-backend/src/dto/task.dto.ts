import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, IsOptional, IsEnum, IsDate } from 'class-validator';
import { TaskStatus } from '../models/task.model';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty({ description: 'Titre de la tâche' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description détaillée de la tâche' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Montant de la récompense', minimum: 0 })
  @IsNumber()
  @Min(0)
  reward: number;

  @ApiProperty({ description: "Niveau d'importance de la tâche", enum: ['LOW', 'MEDIUM', 'HIGH'] })
  @IsNotEmpty()
  @IsString()
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Titre de la tâche' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Description détaillée de la tâche' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Montant de la récompense', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reward?: number;

  @ApiPropertyOptional({ enum: TaskStatus, description: 'Statut de la tâche' })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ description: "Niveau d'importance de la tâche", enum: ['LOW', 'MEDIUM', 'HIGH'] })
  @IsOptional()
  @IsString()
  importance?: 'LOW' | 'MEDIUM' | 'HIGH';

  @ApiPropertyOptional({ description: 'Date de complétion de la tâche' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;
}

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  reward: number;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH'] })
  importance: 'LOW' | 'MEDIUM' | 'HIGH';

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiProperty()
  updatedAt: Date;
} 