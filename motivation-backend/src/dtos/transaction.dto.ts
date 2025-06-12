import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsDate } from 'class-validator';

import { TransactionType } from 'src/schemas/transaction-type.enum';

export class CreateTransactionDto {
    @ApiProperty({ description: 'Titre de la transaction' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Montant de la transaction (>= 0 si Tâche ou < 0 si Récompense)' })
    @IsNumber()
    sum: number;

    @ApiProperty({ enum: TransactionType, description: 'Type de transaction' })
    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType;
}

export class UpdateTransactionDto {
    @ApiPropertyOptional({ description: 'Titre de la transaction' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: 'Montant de la transaction (>= 0 si Tâche ou < 0 si Récompense)' })
    @IsOptional()
    @IsNumber()
    sum?: number;

    @ApiPropertyOptional({ description: 'Date de complétion de la transaction' })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    completedAt?: Date;
}
