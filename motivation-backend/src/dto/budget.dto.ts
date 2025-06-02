import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export enum TransactionType {
    REWARD = 'REWARD',
    EXPENSE = 'EXPENSE'
}

export class AddTransactionDto {
    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty({ enum: TransactionType })
    @IsEnum(TransactionType)
    type: TransactionType;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    taskId?: string;
}

export class TransactionResponseDto {
    @ApiProperty()
    _id: Types.ObjectId;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: TransactionType })
    type: TransactionType;

    @ApiProperty()
    description: string;

    @ApiProperty({ required: false })
    taskId?: Types.ObjectId;

    @ApiProperty()
    date: Date;
}

export class BudgetResponseDto {
    @ApiProperty()
    _id: Types.ObjectId;

    @ApiProperty()
    total: number;

    @ApiProperty({ type: [TransactionResponseDto] })
    transactions: TransactionResponseDto[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
} 