import { ApiProperty } from '@nestjs/swagger';

export class RequestTokenDto {
  @ApiProperty()
  readonly toAddress: string;
  @ApiProperty()
  readonly signature: string;
}
