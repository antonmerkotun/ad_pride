import { Project } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export namespace GetManyDto {
  export class Query {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    offset?: number;

    @IsOptional()
    @IsString()
    search?: string;
  }

  export type Response = {
    data: Project[];
    total: number;
    size: number;
    offset: number;
    limit: number;
  };
}
