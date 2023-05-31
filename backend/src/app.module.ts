import { Module } from '@nestjs/common';
import { VoteTokenController } from './controllers/voteToken.controller';
import { VoteTokenService } from './services/voteToken.service';
import { ConfigModule } from '@nestjs/config';
import { BallotController } from './controllers/ballot.controller';
import { BallotService } from './services/ballot.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [VoteTokenController, BallotController],
  providers: [VoteTokenService, BallotService],
})
export class AppModule {}
