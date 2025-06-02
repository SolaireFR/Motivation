import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BudgetService } from '../services/budget.service';
import { BudgetResponseDto, TransactionResponseDto, AddTransactionDto } from '../dto/budget.dto';

@ApiTags('Budget')
@Controller('budget')
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) {}

    @Get()
    @ApiOperation({ summary: "Obtenir l'état du budget" })
    @ApiResponse({ status: 200, description: 'État du budget', type: BudgetResponseDto })
    async getBudget(): Promise<BudgetResponseDto> {
        return await this.budgetService.getBudget();
    }

    @Get('total')
    @ApiOperation({ summary: 'Obtenir le montant total' })
    @ApiResponse({ status: 200, description: 'Montant total du budget' })
    async getTotal(): Promise<{ total: number }> {
        const budget = await this.budgetService.getBudget();
        return { total: budget.total };
    }

    @Get('transactions')
    @ApiOperation({ summary: "Obtenir l'historique des transactions" })
    @ApiResponse({ status: 200, description: 'Liste des transactions', type: [TransactionResponseDto] })
    async getTransactions(): Promise<TransactionResponseDto[]> {
        return await this.budgetService.getTransactions();
    }

    @Post('transactions')
    @ApiOperation({ summary: 'Ajouter une transaction' })
    @ApiResponse({ status: 201, description: 'Transaction ajoutée', type: TransactionResponseDto })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    async addTransaction(@Body() transactionDto: AddTransactionDto): Promise<TransactionResponseDto> {
        try {
            return await this.budgetService.addTransaction(transactionDto);
        } catch (error) {
            throw new HttpException(
                error.message || "Erreur lors de l'ajout de la transaction",
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('reset')
    @ApiOperation({ summary: 'Réinitialiser le budget' })
    @ApiResponse({ status: 200, description: 'Budget réinitialisé', type: BudgetResponseDto })
    async resetBudget(): Promise<BudgetResponseDto> {
        try {
            return await this.budgetService.resetBudget();
        } catch (error) {
            throw new HttpException(
                error.message || 'Erreur lors de la réinitialisation du budget',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
