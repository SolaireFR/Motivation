import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransactionType } from '../dto/budget.dto';

export type BudgetDocument = Budget & Document;

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ type: Types.ObjectId, required: true, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: TransactionType })
    type: TransactionType;

    @Prop({ required: true })
    description: string;

    @Prop({ type: Types.ObjectId })
    taskId?: Types.ObjectId;

    @Prop({ required: true })
    date: Date;
}

@Schema({ timestamps: true })
export class Budget {
    @Prop({ type: Types.ObjectId, required: true, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true, default: 0 })
    total: number;

    @Prop({ type: [Transaction], default: [] })
    transactions: Transaction[];

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget); 