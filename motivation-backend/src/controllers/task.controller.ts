import { Controller, Get, Post, Patch, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../dto/task.dto';
import { Task } from '../schemas/task.schema';

@ApiTags('Taches')
@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get()
    @ApiOperation({ summary: 'Récupérer toutes les tâches' })
    @ApiResponse({ status: 200, description: 'Liste des tâches', type: [TaskResponseDto] })
    async getAllTasks(): Promise<Task[]> {
        return this.taskService.getAllTasks();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une tâche par son ID' })
    @ApiResponse({ status: 200, description: 'La tâche', type: TaskResponseDto })
    @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
    async getTaskById(@Param('id') id: string): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle tâche' })
    @ApiResponse({ status: 201, description: 'Tâche créée', type: TaskResponseDto })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskService.createTask(createTaskDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour une tâche' })
    @ApiResponse({ status: 200, description: 'Tâche mise à jour', type: TaskResponseDto })
    @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
    async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
        return this.taskService.updateTask(id, updateTaskDto);
    }

    @Post(':id/complete')
    @ApiOperation({ summary: 'Marquer une tâche comme terminée' })
    @ApiResponse({ status: 200, description: 'Tâche terminée', type: TaskResponseDto })
    @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
    async completeTask(@Param('id') id: string): Promise<Task> {
        return this.taskService.completeTask(id);
    }

    @Post(':id/reopen')
    @ApiOperation({ summary: 'Réouvrir une tâche terminée' })
    @ApiResponse({ status: 200, description: 'Tâche réouverte', type: TaskResponseDto })
    @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
    async reopenTask(@Param('id') id: string): Promise<Task> {
        return this.taskService.reopenTask(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une tâche' })
    @ApiResponse({ status: 200, description: 'Tâche supprimée' })
    @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
    async deleteTask(@Param('id') id: string): Promise<void> {
        return this.taskService.deleteTask(id);
    }
}
