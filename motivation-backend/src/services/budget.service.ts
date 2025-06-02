import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget, BudgetDocument, Transaction } from '../schemas/budget.schema';
import { AddTransactionDto, BudgetResponseDto, TransactionResponseDto, TransactionType } from '../dto/budget.dto';

@Injectable()
export class BudgetService {
    constructor(
        @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>
    ) {
        this.initializeBudget();
    }

    private async initializeBudget() {
        const budgetCount = await this.budgetModel.countDocuments();
        if (budgetCount === 0) {
            await this.budgetModel.create({
                total: 0,
                transactions: []
            });
        }
    }

    async getBudget(): Promise<BudgetResponseDto> {
        const budget = await this.budgetModel.findOne().lean().exec();
        if (!budget) {
            throw new Error('Budget non trouvé');
        }
        return {
            _id: budget._id,
            total: budget.total,
            transactions: budget.transactions,
            createdAt: budget.createdAt,
            updatedAt: budget.updatedAt
        };
    }

    async addTransaction(transactionDto: AddTransactionDto): Promise<TransactionResponseDto> {
        const budget = await this.budgetModel.findOne().exec();
        if (!budget) {
            throw new Error('Budget non trouvé');
        }

        const transaction: Transaction = {
            _id: new Types.ObjectId(),
            ...transactionDto,
            date: new Date(),
            taskId: transactionDto.taskId ? new Types.ObjectId(transactionDto.taskId) : undefined
        };

        budget.transactions.unshift(transaction);
        budget.total += transaction.type === TransactionType.REWARD ? transaction.amount : -transaction.amount;

        await budget.save();

        return {
            _id: transaction._id,
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description,
            taskId: transaction.taskId,
            date: transaction.date
        };
    }

    async getTransactions(): Promise<TransactionResponseDto[]> {
        const budget = await this.budgetModel.findOne().exec();
        if (!budget) {
            throw new Error('Budget non trouvé');
        }
        return budget.transactions.map(t => ({
            _id: t._id,
            amount: t.amount,
            type: t.type,
            description: t.description,
            taskId: t.taskId,
            date: t.date
        }));
    }

    async resetBudget(): Promise<BudgetResponseDto> {
        const budget = await this.budgetModel.findOne().lean().exec();
        if (!budget) {
            throw new Error('Budget non trouvé');
        }

        const updatedBudget = await this.budgetModel.findOneAndUpdate(
            {},
            { total: 0, transactions: [] },
            { new: true }
        ).lean().exec();

        if (!updatedBudget) {
            throw new Error('Erreur lors de la réinitialisation du budget');
        }

        return {
            _id: updatedBudget._id,
            total: updatedBudget.total,
            transactions: updatedBudget.transactions,
            createdAt: updatedBudget.createdAt,
            updatedAt: updatedBudget.updatedAt
        };
    }
} 