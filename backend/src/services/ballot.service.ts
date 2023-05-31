import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as ballotJson from '../assets/TokenizedBallot.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BallotService {
  provider: ethers.providers.Provider;
  ballotContract: ethers.Contract;
  contractSymbol: string;
  privateKey: string;
  wallet: ethers.Wallet;
  signer: ethers.Wallet;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('INFURA_API_KEY');
    const contractAddress = this.configService.get<string>('BALLOT_ADDRESS');
    const network = this.configService.get<string>('NETWORK');
    const privateKey = this.configService.get<string>('MNEMONIC');

    const wallet = ethers.Wallet.fromMnemonic(privateKey);
    const provider = new ethers.providers.InfuraProvider(network, apiKey);

    this.signer = wallet.connect(provider);

    this.ballotContract = new ethers.Contract(
      contractAddress,
      ballotJson.abi,
      provider,
    );
  }

  formatUnit(bigNum) {
    return parseInt(ethers.utils.formatEther(bigNum));
  }

  async getProposals() {
    const rawProposalCount = await this.ballotContract.getProposalsCount();
    const proposalCount = parseInt(
      ethers.utils.formatUnits(rawProposalCount, 'wei'),
    );

    const proposals = [];

    for (let i = 0; i < proposalCount; i++) {
      const [proposalName, votes] = await this.ballotContract.proposals(i);
      proposals.push({
        proposalName: ethers.utils.parseBytes32String(proposalName),
        votes: this.formatUnit(votes),
      });
    }

    return { proposals };
  }

  async getAvailableVotes(address) {
    const rawVotingPower = await this.ballotContract.votingPower(address);
    const availableVotes = this.formatUnit(rawVotingPower);

    return {
      address,
      availableVotes,
    };
  }
}
