import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BudgetService } from '../services/budget.service';
import { BudgetResponseDto, AddHistoryEntryDto, HistoryEntryResponseDto } from '../dto/budget.dto';

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

    @Post('history')
    @ApiOperation({ summary: "Ajouter une entrée dans l'historique" })
    @ApiResponse({ status: 201, description: 'Entrée ajoutée', type: HistoryEntryResponseDto })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    async addHistoryEntry(@Body() entryDto: AddHistoryEntryDto): Promise<HistoryEntryResponseDto> {
        try {
            return await this.budgetService.addHistoryEntry(entryDto);
        } catch (error) {
            throw new HttpException(error.message || "Erreur lors de l'ajout de l'entrée", HttpStatus.BAD_REQUEST);
        }
    }

    // @Post('reset')
    // @ApiOperation({ summary: 'Réinitialiser le budget' })
    // @ApiResponse({ status: 200, description: 'Budget réinitialisé', type: BudgetResponseDto })
    // async resetBudget(): Promise<BudgetResponseDto> {
    //     try {
    //         return await this.budgetService.resetBudget();
    //     } catch (error) {
    //         throw new HttpException(
    //             error.message || 'Erreur lors de la réinitialisation du budget',
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }
}
