import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskStatus } from '../models/task.model';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, min: 0 })
  reward: number;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.ACTIVE })
  status: TaskStatus;

  @Prop()
  completedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task); 