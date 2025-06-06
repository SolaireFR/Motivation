import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class AddHistoryEntryDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNumber()
    amount: number;
}

export class HistoryEntryResponseDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    createdAt: Date;
}

export class BudgetResponseDto {
    @ApiProperty()
    _id: Types.ObjectId;

    @ApiProperty()
    total: number;

    @ApiProperty({ type: [HistoryEntryResponseDto] })
    history: HistoryEntryResponseDto[];
}
