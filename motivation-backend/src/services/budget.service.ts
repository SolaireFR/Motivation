import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget, BudgetDocument, HistoryEntry } from '../schemas/budget.schema';
import { AddHistoryEntryDto, BudgetResponseDto, HistoryEntryResponseDto } from '../dto/budget.dto';

@Injectable()
export class BudgetService {
    constructor(@InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>) {
        this.initializeBudget();
    }

    private async initializeBudget() {
        const budgetCount = await this.budgetModel.countDocuments();
        if (budgetCount === 0) {
            await this.budgetModel.create({
                _id: new Types.ObjectId(),
                total: 0,
                history: [],
            });
        }
    }

    async getBudget(): Promise<BudgetResponseDto> {
        const budget = await this.budgetModel.findOne().lean().exec();

        if (!budget) {
            const newBudget = await this.budgetModel.create({
                _id: new Types.ObjectId(),
                total: 0,
                history: [],
            });

            const createdBudget = newBudget.toObject();
            return {
                _id: createdBudget._id,
                total: createdBudget.total,
                history: createdBudget.history,
            };
        }

        return {
            _id: budget._id,
            total: budget.total,
            history: budget.history,
        };
    }

    async addHistoryEntry(entryDto: AddHistoryEntryDto): Promise<HistoryEntryResponseDto> {
        const budget = await this.budgetModel.findOne().exec();

        if (!budget) {
            const newBudget = await this.budgetModel.create({
                _id: new Types.ObjectId(),
                total: 0,
                history: [],
            });

            const historyEntry: HistoryEntry = {
                title: entryDto.title,
                amount: entryDto.amount,
                createdAt: new Date(),
            };

            newBudget.history.unshift(historyEntry);
            newBudget.total = historyEntry.amount;
            await newBudget.save();

            return {
                title: historyEntry.title,
                amount: historyEntry.amount,
                createdAt: historyEntry.createdAt,
            };
        }

        const historyEntry: HistoryEntry = {
            title: entryDto.title,
            amount: entryDto.amount,
            createdAt: new Date(),
        };

        budget.history.unshift(historyEntry);
        budget.total += historyEntry.amount;
        await budget.save();

        return {
            title: historyEntry.title,
            amount: historyEntry.amount,
            createdAt: historyEntry.createdAt,
        };
    }

    async resetBudget(): Promise<BudgetResponseDto> {
        const budget = await this.budgetModel.findOne().exec();

        if (!budget) {
            const newBudget = await this.budgetModel.create({
                _id: new Types.ObjectId(),
                total: 0,
                history: [],
            });

            const createdBudget = newBudget.toObject();
            return {
                _id: createdBudget._id,
                total: createdBudget.total,
                history: createdBudget.history,
            };
        }

        budget.total = 0;
        budget.history = [];
        await budget.save();

        return {
            _id: budget._id,
            total: budget.total,
            history: budget.history,
        };
    }
}
