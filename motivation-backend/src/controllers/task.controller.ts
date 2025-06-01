import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../dto/task.dto';
import { Task } from '../models/task.model';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les tâches' })
  @ApiResponse({ status: 200, description: 'Liste des tâches', type: [TaskResponseDto] })
  getAllTasks(): Task[] {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une tâche par son ID' })
  @ApiResponse({ status: 200, description: 'La tâche', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle tâche' })
  @ApiResponse({ status: 201, description: 'Tâche créée', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    const { title, description, reward } = createTaskDto;
    return this.taskService.createTask(title, description, reward);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une tâche' })
  @ApiResponse({ status: 200, description: 'Tâche mise à jour', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Task {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Marquer une tâche comme terminée' })
  @ApiResponse({ status: 200, description: 'Tâche terminée', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  completeTask(@Param('id') id: string): Task {
    return this.taskService.completeTask(id);
  }

  @Put(':id/reopen')
  @ApiOperation({ summary: 'Réouvrir une tâche terminée' })
  @ApiResponse({ status: 200, description: 'Tâche réouverte', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  reopenTask(@Param('id') id: string): Task {
    return this.taskService.reopenTask(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une tâche' })
  @ApiResponse({ status: 200, description: 'Tâche supprimée' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  deleteTask(@Param('id') id: string): void {
    this.taskService.deleteTask(id);
  }
} 