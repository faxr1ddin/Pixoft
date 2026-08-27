import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'TechUz' })
  @IsString()
  company: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiProperty({ enum: ["To'liq stavka", 'Yarim stavka', 'Masofaviy', 'Vaqtinchalik'] })
  @IsIn(["To'liq stavka", 'Yarim stavka', 'Masofaviy', 'Vaqtinchalik'])
  workType: string;

  @ApiProperty({ example: 'Toshkent' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ enum: ['Erkak', 'Ayol'] })
  @IsOptional()
  @IsIn(['Erkak', 'Ayol'])
  gender?: string;

  @ApiProperty({ example: 3000000 })
  @IsInt()
  @Min(0)
  salaryMin: number;

  @ApiPropertyOptional({ example: 7000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

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

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

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
