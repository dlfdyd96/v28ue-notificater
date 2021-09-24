import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseResponse } from 'src/api/entities/response_entities/base.response';

export class CreateTaskRequestDto {
  @IsString()
  @ApiProperty({ type: String, example: `V28UE_WATCHING` })
  name: string;

  @IsString()
  @ApiProperty({
    type: String,
    example:
      'https://www.jooyonshop.co.kr/goods/goods_view.php?goodsNo=1000000165',
  })
  url: string;

  @IsString()
  @ApiProperty({
    type: String,
    example: `#frmView > div > div > div.btn_choice_box > div > button.btn_add_order`,
  })
  jsPath: string;
}

export class CreateTaskResponseDto extends BaseResponse {
  constructor() {
    super();
  }
}
