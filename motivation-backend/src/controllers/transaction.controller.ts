import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto, UpdateTransactionDto } from '../dtos/transaction.dto';
import { Transaction } from '../schemas/transaction.schema';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get()
    @ApiOperation({ summary: 'Récupérer toutes les transactions' })
    @ApiResponse({ status: 200, description: 'Liste des transactions', type: [Transaction] })
    async getAllTransactions(): Promise<Transaction[]> {
        return this.transactionService.getAllTransactions();
    }

    // @Get(':id')
    // @ApiOperation({ summary: 'Récupérer une transaction par son ID' })
    // @ApiResponse({ status: 200, description: 'La transaction', type: Transaction })
    // @ApiResponse({ status: 404, description: 'Transaction non trouvée' })
    // async getTransactionById(@Param('id') id: string): Promise<Transaction> {
    //     return this.transactionService.getTransactionById(id);
    // }

    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle transaction' })
    @ApiResponse({ status: 201, description: 'Transaction créée', type: Transaction })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionService.createTransaction(createTransactionDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour une transaction' })
    @ApiResponse({ status: 200, description: 'Transaction mise à jour', type: Transaction })
    @ApiResponse({ status: 404, description: 'Transaction non trouvée' })
    async updateTransaction(
        @Param('id') id: string,
        @Body() updateTransactionDto: UpdateTransactionDto,
    ): Promise<Transaction> {
        return this.transactionService.updateTransaction(id, updateTransactionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une transaction' })
    @ApiResponse({ status: 200, description: 'Transaction supprimée' })
    @ApiResponse({ status: 404, description: 'Transaction non trouvée' })
    async deleteTransaction(@Param('id') id: string): Promise<void> {
        return this.transactionService.deleteTransaction(id);
    }
}
