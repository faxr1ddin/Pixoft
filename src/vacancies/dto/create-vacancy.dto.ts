import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RoleDto } from './role.dto';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  title: string;

  @ApiProperty({ type: [RoleDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles: RoleDto[];

  @ApiPropertyOptional({ example: 'TechUz' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiProperty({ enum: ['IT', 'Savdo', 'Xizmat', 'Boshqa'] })
  @IsIn(['IT', 'Savdo', 'Xizmat', 'Boshqa'])
  category: string;

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

  @ApiPropertyOptional({ example: 'Dushanba-Juma, 09:00-18:00' })
  @IsOptional()
  @IsString()
  workSchedule?: string;

  @ApiPropertyOptional({ example: 'Chilonzor tumani, 5-uy' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Job duties and any details not in structured fields' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [String], example: ['Ovqatlanish', 'Transport'] })
  @IsArray()
  @IsString({ each: true })
  benefits: string[];

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
