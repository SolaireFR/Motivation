import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import { TransactionType } from './transaction-type.enum';
import { ExposeId } from 'src/utils/decorators/expose-id.decorator';

export type TransactionDocument = Transaction & Document;

@Exclude()
@Schema({ timestamps: true })
export class Transaction {
    @Expose()
    @ExposeId()
    _id: ObjectId | string;

    @Expose()
    @Prop({ required: true })
    title: string;

    @Expose()
    @Prop({ required: true })
    sum: number;

    @Expose()
    @Prop({ required: true, enum: TransactionType })
    type: TransactionType;

    @Expose()
    @Prop()
    completedAt?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
