import { TransactionType } from "./transaction-type.enum";

export class Transaction {
    _id: string;
    title: string;
    sum: number;
    type: TransactionType;
    completedAt?: Date;
}
