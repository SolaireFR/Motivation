import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TransactionType } from '../models/budget.model';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Task' })
  taskId?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

@Schema()
export class Budget extends Document {
  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ type: [TransactionSchema] })
  transactions: Transaction[];
}

export const BudgetSchema = SchemaFactory.createForClass(Budget); 