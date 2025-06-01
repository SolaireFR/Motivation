import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { TaskStatus } from '../models/task.model';

export class CreateTaskDto {
  @ApiProperty({ description: 'Titre de la tâche' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description détaillée de la tâche' })
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Montant de la récompense', minimum: 0 })
  @IsNumber()
  @Min(0)
  reward: number;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Titre de la tâche' })
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Description détaillée de la tâche' })
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Montant de la récompense', minimum: 0 })
  @IsNumber()
  @Min(0)
  reward?: number;

  @ApiPropertyOptional({ enum: TaskStatus, description: 'Statut de la tâche' })
  status?: TaskStatus;
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

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  completedAt?: Date;
} 