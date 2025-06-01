import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BudgetService } from '../services/budget.service';
import { AddRewardDto, AddExpenseDto, BudgetResponseDto, TransactionResponseDto } from '../dto/budget.dto';
import { Budget, Transaction } from '../models/budget.model';

@ApiTags('budget')
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir l\'état du budget' })
  @ApiResponse({ status: 200, description: 'État du budget', type: BudgetResponseDto })
  getBudget(): Budget {
    return this.budgetService.getBudget();
  }

  @Get('total')
  @ApiOperation({ summary: 'Obtenir le montant total' })
  @ApiResponse({ status: 200, description: 'Montant total du budget' })
  getTotal(): { total: number } {
    return { total: this.budgetService.getTotal() };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Obtenir l\'historique des transactions' })
  @ApiResponse({ status: 200, description: 'Liste des transactions', type: [TransactionResponseDto] })
  getTransactions(): Transaction[] {
    return this.budgetService.getTransactions();
  }

  @Post('reward')
  @ApiOperation({ summary: 'Ajouter une récompense' })
  @ApiResponse({ status: 201, description: 'Récompense ajoutée', type: TransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  addReward(@Body() addRewardDto: AddRewardDto): Transaction {
    const { amount, description, taskId } = addRewardDto;
    return this.budgetService.addReward(amount, description, taskId);
  }

  @Post('expense')
  @ApiOperation({ summary: 'Ajouter une dépense' })
  @ApiResponse({ status: 201, description: 'Dépense ajoutée', type: TransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  addExpense(@Body() addExpenseDto: AddExpenseDto): Transaction {
    const { amount, description } = addExpenseDto;
    return this.budgetService.addExpense(amount, description);
  }
} 