import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { CreateTransactionDto, UpdateTransactionDto } from 'src/dtos/transaction.dto';
import { TransactionType } from 'src/schemas/transaction-type.enum';

@Injectable()
export class TransactionService {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>) {}

    async getAllTransactions(): Promise<Transaction[]> {
        return this.transactionModel.find().exec();
    }

    async getTransactionById(id: string): Promise<Transaction> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`L'ID ${id} n'est pas un ID MongoDB valide`);
        }

        const transaction = await this.transactionModel.findById(id).exec();
        if (!transaction) {
            throw new NotFoundException(`La tâche avec l'ID ${id} n'a pas été trouvée`);
        }
        return transaction;
    }

    async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
        if (
            (dto.type === TransactionType.TASK && dto.sum < 0) ||
            (dto.type === TransactionType.REWARD && dto.sum >= 0)
        ) {
            throw new BadRequestException(
                'La somme doit être positive pour les tâches et négative ou égal à zero pour les récompenses',
            );
        }
        const createdTransaction = new this.transactionModel({ ...dto });
        return await createdTransaction.save();
    }

    async updateTransaction(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`L'ID ${id} n'est pas un ID MongoDB valide`);
        }

        const updatedTransaction = await this.transactionModel
            .findByIdAndUpdate(id, { ...dto }, { new: true, runValidators: true })
            .exec();

        if (!updatedTransaction) {
            throw new NotFoundException(`La tâche avec l'ID ${id} n'a pas été trouvée`);
        }
        return updatedTransaction;
    }

    async deleteTransaction(id: string): Promise<void> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`L'ID ${id} n'est pas un ID MongoDB valide`);
        }

        const result = await this.transactionModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`La tâche avec l'ID ${id} n'a pas été trouvée`);
        }
    }
}
