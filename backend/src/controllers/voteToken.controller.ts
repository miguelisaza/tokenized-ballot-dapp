import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { VoteTokenService } from '../services/voteToken.service';
import { RequestTokenDto } from '../dtos/requestToken.dto';
import { RequestSignatureDto } from '../dtos/requestSignature.dto';
import { AuthenticateSignature } from '../dtos/authenticateSignature.dto';

@Controller()
export class VoteTokenController {
  constructor(private readonly voteTokenService: VoteTokenService) {}

  @Get('total-supply')
  async getTotalSupply() {
    return await this.voteTokenService.getTotalSupply();
  }

  @Get('balance/:address')
  getBalance(@Param('address') address: string) {
    return this.voteTokenService.getBalance(address);
  }

  @Post('request-signature')
  requestSignature(@Body() body: RequestSignatureDto) {
    return this.voteTokenService.requestSignature(body.address);
  }

  @Post('authenticate-signature')
  authenticateSignature(@Body() body: AuthenticateSignature) {
    return this.voteTokenService.authenticateClient(
      body.address,
      body.signedMessage,
    );
  }

  @Post('request-token')
  requestToken(@Body() body: RequestTokenDto) {
    return this.voteTokenService.requestToken(body.toAddress, body.signature);
  }

  @Post('request-power')
  votingPower(@Body() body: RequestTokenDto) {
    return this.voteTokenService.requestVotingPower(
      body.toAddress,
      body.signature,
    );
  }
}
