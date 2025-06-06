import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskStatus } from '../models/task.model';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
    _id: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    reward: number;

    @Prop({ required: true, enum: TaskStatus, default: TaskStatus.ACTIVE })
    status: TaskStatus;

    @Prop({ required: true, enum: ['LOW', 'MEDIUM', 'HIGH'] })
    importance: 'LOW' | 'MEDIUM' | 'HIGH';

    @Prop()
    completedAt?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
