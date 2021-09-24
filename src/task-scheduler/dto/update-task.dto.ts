import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateTaskRequestDto {
  @IsBoolean()
  @ApiProperty({
    description: `true = start, false = stop`,
  })
  start: true;
}
