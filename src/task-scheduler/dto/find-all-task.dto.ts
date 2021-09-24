import { ApiProperty } from '@nestjs/swagger';
import { boolean } from 'joi';
import { BaseResponse } from 'src/api/entities/response_entities/base.response';

export class JobStatus {
  @ApiProperty({ description: 'job name' })
  name: string;
  @ApiProperty({ description: 'running = true, stop = false' })
  status: boolean;
}

export class FindAllTasksResponseDto extends BaseResponse {
  constructor() {
    super();
  }

  @ApiProperty({ description: 'all Jobs data', type: [JobStatus] })
  jobs: JobStatus[];
}
