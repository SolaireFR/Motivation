import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BudgetDocument = Budget & Document;

@Schema()
export class HistoryEntry {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, default: Date.now })
    createdAt: Date;
}

@Schema()
export class Budget {
    @Prop({ type: Types.ObjectId, required: true, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true, default: 0 })
    total: number;

    @Prop({ type: [HistoryEntry], default: [] })
    history: HistoryEntry[];
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
