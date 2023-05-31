import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from '../assets/VoteToken.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VoteTokenService {
  provider: ethers.providers.Provider;
  voteTokenContract: ethers.Contract;
  contractSymbol: string;
  privateKey: string;
  wallet: ethers.Wallet;
  signer: ethers.Wallet;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('INFURA_API_KEY');
    const contractAddress = this.configService.get<string>('TOKEN_ADDRESS');
    const network = this.configService.get<string>('NETWORK');
    const privateKey = this.configService.get<string>('MNEMONIC');

    const wallet = ethers.Wallet.fromMnemonic(privateKey);

    this.provider = new ethers.providers.InfuraProvider(network, apiKey);
    this.signer = wallet.connect(this.provider);

    this.voteTokenContract = new ethers.Contract(
      contractAddress,
      tokenJson.abi,
      this.provider,
    ).connect(this.signer);
  }
  private nonceStore: { [key: string]: number } = {};

  private messageToSign(nonce) {
    return `I am signing this message to authenticate with the server. Nonce: ${nonce}`;
  }

  private getNonceForUser(signerAddress: string): number {
    // check if nonce for the user exists
    if (!this.nonceStore[signerAddress]) {
      // if not, initialize it with a random number
      this.nonceStore[signerAddress] = Math.floor(Math.random() * 10000);
    }

    return this.nonceStore[signerAddress];
  }

  requestSignature(signerAddress) {
    const nonce = this.getNonceForUser(signerAddress);
    const messageToSign = this.messageToSign(nonce);

    return { messageToSign };
  }

  async authenticateClient(signerAddress: string, signedMessage: string) {
    const nonce = this.getNonceForUser(signerAddress);

    const message = this.messageToSign(nonce);

    let recoveredAddress;
    try {
      recoveredAddress = ethers.utils.verifyMessage(message, signedMessage);
    } catch {
      throw new Error('Failed to verify signature');
    }

    if (recoveredAddress === signerAddress) {
      return true;
    } else {
      throw new Error('Failed to authenticate');
    }
  }

  formatUnit(bigNum) {
    return parseInt(ethers.utils.formatEther(bigNum));
  }

  async getContractSymbol() {
    return await this.voteTokenContract.symbol();
  }

  async getTotalSupply() {
    const rawSupply = await this.voteTokenContract.totalSupply();
    const symbol = await this.getContractSymbol();

    return { symbol, totalSupply: this.formatUnit(rawSupply) };
  }

  async getBalance(address: string) {
    const symbol = await this.getContractSymbol();
    const rawBalance = await this.voteTokenContract.balanceOf(address);

    return { symbol, balance: this.formatUnit(rawBalance) };
  }

  requestToken(address: string, signature: string) {
    if (this.authenticateClient(address, signature))
      return this.voteTokenContract.mint(address, ethers.utils.parseUnits('1'));
  }

  requestVotingPower(address: string, signature) {
    if (this.authenticateClient(address, signature))
      return this.voteTokenContract.delegate(address);
  }
}
