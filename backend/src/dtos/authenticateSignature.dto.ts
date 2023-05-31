import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateSignature {
  @ApiProperty()
  readonly address: string;
  @ApiProperty()
  readonly signedMessage: string;
}
