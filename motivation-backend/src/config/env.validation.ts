import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  MONGODB_HOST: string;

  @IsNumber()
  MONGODB_PORT: number;

  @IsString()
  MONGODB_USER: string;

  @IsString()
  MONGODB_PASSWORD: string;

  @IsString()
  MONGODB_DATABASE: string;

  @IsString()
  MONGODB_URI: string;

  @IsString()
  SWAGGER_TITLE: string;

  @IsString()
  SWAGGER_DESCRIPTION: string;

  @IsString()
  SWAGGER_VERSION: string;

  @IsString()
  SWAGGER_PATH: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
} 