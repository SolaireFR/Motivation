import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { TransactionType } from '../models/budget.model';

export class AddRewardDto {
  @ApiProperty({ description: 'Montant de la récompense', minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Description de la récompense' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'ID de la tâche associée' })
  @IsString()
  taskId?: string;
}

export class AddExpenseDto {
  @ApiProperty({ description: 'Montant de la dépense', minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Description de la dépense' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiPropertyOptional()
  taskId?: string;
}

export class BudgetResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: [TransactionResponseDto] })
  transactions: TransactionResponseDto[];
} 