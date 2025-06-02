import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskStatus } from '../models/task.model';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, min: 0 })
  reward: number;

  @Prop({ required: true, enum: ['LOW', 'MEDIUM', 'HIGH'] })
  importance: 'LOW' | 'MEDIUM' | 'HIGH';

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.ACTIVE })
  status: TaskStatus;

  @Prop()
  completedAt?: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task); 