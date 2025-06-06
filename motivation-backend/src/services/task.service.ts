import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { TaskStatus } from '../models/task.model';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

    async getAllTasks(): Promise<Task[]> {
        return this.taskModel.find().exec();
    }

    async getTaskById(id: string): Promise<Task> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`L'ID ${id} n'est pas un ID MongoDB valide`);
        }

        const task = await this.taskModel.findById(id).exec();
        if (!task) {
            throw new NotFoundException(`La tâche avec l'ID ${id} n'a pas été trouvée`);
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        try {
            const createdTask = new this.taskModel({
                ...createTaskDto,
                status: TaskStatus.ACTIVE,
                reward: Math.max(0, Number(createTaskDto.reward) || 0),
            });
            return await createdTask.save();
        } catch (error) {
            throw new BadRequestException('Données de tâche invalides');
        }
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`L'ID ${id} n'est pas un ID MongoDB valide`);
        }

        try {
            // S'assurer que la récompense est un nombre positif si elle est fournie
            if (updateTaskDto.reward !== undefined) {
                updateTaskDto.reward = Math.max(0, Number(updateTaskDto.reward) || 0);
            }

            const updatedTask = await this.taskModel
                .findByIdAndUpdate(id, { ...updateTaskDto }, { new: true, runValidators: true })
                .exec();

            if (!updatedTask) {
                throw new NotFoundException(`La tâche avec l'ID ${id} n'a pas été trouvée`);
            }
            return updatedTask;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Données de mise à jour invalides');
        }
    }

    async completeTask(id: string): Promise<Task> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`L'ID ${id} n'est pas un ID MongoDB valide`);
        }

        const task = await this.getTaskById(id);
        if (task.status === TaskStatus.COMPLETED) {
            throw new BadRequestException('La tâche est déjà complétée');
        }

        return this.updateTask(id, {
            status: TaskStatus.COMPLETED,
            completedAt: new Date(),
        });
    }

    async reopenTask(id: string): Promise<Task> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`L'ID ${id} n'est pas un ID MongoDB valide`);
        }

        const task = await this.getTaskById(id);
        if (task.status === TaskStatus.ACTIVE) {
            throw new BadRequestException('La tâche est déjà active');
        }

        return this.updateTask(id, {
            status: TaskStatus.ACTIVE,
            completedAt: undefined,
        });
    }

    async deleteTask(id: string): Promise<void> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`L'ID ${id} n'est pas un ID MongoDB valide`);
        }

        const result = await this.taskModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`La tâche avec l'ID ${id} n'a pas été trouvée`);
        }
    }
}
