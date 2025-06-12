import { Type } from "class-transformer";
import { TransactionType } from "../models/transaction-type.enum";

export class CreateTransactionDto {
    title: string;
    sum: number;
    type: TransactionType;

    constructor(partial: Partial<CreateTransactionDto>) {
        this.title = partial.title || '';
        this.sum = partial.sum || 0;
        this.type = partial.type || TransactionType.TASK;
    }
}

export class UpdateTransactionDto {
    title?: string;
    sum?: number;

    @Type(() => Date)
    completedAt?: Date;

    constructor(partial: Partial<UpdateTransactionDto>) {
        this.title = partial.title;
        this.sum = partial.sum;
        this.completedAt = partial.completedAt ? new Date(partial.completedAt) : undefined;
    }
}
