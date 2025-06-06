import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl, body } = request;
        const userAgent = request.get('user-agent') || '';
        const startTime = Date.now();

        // Log de la requête entrante
        this.logger.log(`Requête entrante - ${method} ${originalUrl}`);

        // Vérifier si le body existe et n'est pas vide
        if (body && typeof body === 'object' && Object.keys(body).length > 0) {
            this.logger.debug(`Corps de la requête: ${JSON.stringify(body, null, 2)}`);
        }

        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            const responseTime = Date.now() - startTime;

            // Log de la réponse avec code couleur selon le statut
            const logMessage =
                `${method} ${originalUrl} ${statusCode} ${contentLength || 0}b - ${responseTime}ms\n` +
                `IP: ${ip} - User Agent: ${userAgent}`;

            if (statusCode >= 500) {
                this.logger.error(logMessage);
            } else if (statusCode >= 400) {
                this.logger.warn(logMessage);
                if (body && typeof body === 'object') {
                    this.logger.warn(`Corps de la requête en erreur: ${JSON.stringify(body, null, 2)}`);
                }
            } else {
                this.logger.log(logMessage);
            }
        });

        next();
    }
}
