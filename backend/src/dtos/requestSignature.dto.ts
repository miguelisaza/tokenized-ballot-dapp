import { ApiProperty } from '@nestjs/swagger';

export class RequestSignatureDto {
  @ApiProperty()
  readonly address: string;
}
