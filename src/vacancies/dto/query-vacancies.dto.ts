import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryVacanciesDto {
  @ApiPropertyOptional({ default: 20, maximum: 50 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 20;

  @ApiPropertyOptional({ description: 'Last document ID from previous response' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ description: 'Search in title, company, location' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['IT', 'Savdo', 'Xizmat', 'Boshqa'] })
  @IsOptional()
  @IsIn(['IT', 'Savdo', 'Xizmat', 'Boshqa'])
  category?: string;

  @ApiPropertyOptional({ enum: ["To'liq stavka", 'Yarim stavka', 'Masofaviy', 'Vaqtinchalik'] })
  @IsOptional()
  @IsIn(["To'liq stavka", 'Yarim stavka', 'Masofaviy', 'Vaqtinchalik'])
  workType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: ['Erkak', 'Ayol'] })
  @IsOptional()
  @IsIn(['Erkak', 'Ayol'])
  gender?: string;
}
