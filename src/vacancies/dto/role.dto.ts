import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class RoleDto {
  @ApiProperty({ example: 'Overlokchi' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ enum: ['Erkak', 'Ayol'] })
  @IsOptional()
  @IsIn(['Erkak', 'Ayol'])
  gender?: string;

  @ApiPropertyOptional({ example: '20-32' })
  @IsOptional()
  @IsString()
  ageRange?: string;

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

  @ApiProperty({ type: [String], example: ['2 yil tajriba'] })
  @IsArray()
  @IsString({ each: true })
  requirements: string[];
}
