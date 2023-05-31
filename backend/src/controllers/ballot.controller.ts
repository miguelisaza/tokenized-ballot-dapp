import { Controller, Param, Get } from '@nestjs/common';
import { BallotService } from '../services/ballot.service';

@Controller()
export class BallotController {
  constructor(private readonly ballotService: BallotService) {}

  @Get('proposals')
  async getProposals() {
    return await this.ballotService.getProposals();
  }

  @Get('available-votes/:address')
  getBalance(@Param('address') address: string) {
    return this.ballotService.getAvailableVotes(address);
  }
}
