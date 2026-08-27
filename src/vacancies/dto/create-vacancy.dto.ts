import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  title: string;

  @ApiProperty({ type: [String], example: ['Frontend Developer', 'UI Designer'] })
  @IsArray()
  @IsString({ each: true })
  positions: string[];

  @ApiPropertyOptional({ example: 'TechUz' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiPropertyOptional({
    enum: ["To'liq stavka", 'Yarim stavka', 'Masofaviy', 'Vaqtinchalik'],
  })
  @IsOptional()
  @IsIn(["To'liq stavka", 'Yarim stavka', 'Masofaviy', 'Vaqtinchalik'])
  workType?: string;

  @ApiProperty({ type: [String], example: ['Toshkent', 'Andijon'] })
  @IsArray()
  @IsString({ each: true })
  locations: string[];

  @ApiPropertyOptional({ enum: ['Erkak', 'Ayol'] })
  @IsOptional()
  @IsIn(['Erkak', 'Ayol'])
  gender?: string;

  @ApiPropertyOptional({ example: 3000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({ example: 7000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional({ enum: ['UZS', 'USD'] })
  @IsOptional()
  @IsIn(['UZS', 'USD'])
  currency?: string;

  @ApiProperty({ enum: ['IT', 'Savdo', 'Xizmat', 'Boshqa'] })
  @IsIn(['IT', 'Savdo', 'Xizmat', 'Boshqa'])
  category: string;

  @ApiPropertyOptional({ example: '18-35' })
  @IsOptional()
  @IsString()
  ageRange?: string;

  @ApiPropertyOptional({ example: 'Dushanba-Juma, 09:00-18:00' })
  @IsOptional()
  @IsString()
  workSchedule?: string;

  @ApiPropertyOptional({ example: 'Chilonzor tumani, 5-uy' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: [String], example: ['Ovqatlanish', 'Transport'] })
  @IsArray()
  @IsString({ each: true })
  benefits: string[];

  @ApiProperty({ type: [String], example: ['React bilimi', '2 yil tajriba'] })
  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @ApiProperty({ type: [String], example: ['+998901234567'] })
  @IsArray()
  @IsString({ each: true })
  phones: string[];

  @ApiPropertyOptional({ example: '@recruiter' })
  @IsOptional()
  @IsString()
  contactTelegram?: string;

  @ApiPropertyOptional({ example: 'https://t.me/apply' })
  @IsOptional()
  @IsString()
  applyLink?: string;

  @ApiPropertyOptional({ description: 'Original advertisement text (for re-parsing)' })
  @IsOptional()
  @IsString()
  sourceText?: string;
}
