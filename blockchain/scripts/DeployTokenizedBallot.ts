import { ethers } from "hardhat";
import { Wallet } from "ethers";

import {
  MisajiTokenizedBallot,
  MisajiTokenizedBallot__factory,
} from "../typechain-types";

function convertStringArrayToBytes32(array: string[]) {
  return array.map(ethers.utils.formatBytes32String);
}

async function deployContracts(deployer: Wallet): Promise<{
  tokenizedBallotContract: MisajiTokenizedBallot;
}> {
  const proposals = ["Dog", "Cat", "Monkey", "Ferret", "Donkey"];

  console.log("Proposals to Ballot: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  //contract factories
  const tokenizedBallotFactory = new MisajiTokenizedBallot__factory(deployer);

  const rawP = convertStringArrayToBytes32(proposals);

  // deploy tokenizedBallotContract
  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
    rawP,
    "0x26f81d541D9EA69cA73864C928663386A2A02A13"
  );
  const tokenizedBallotContractTxR =
    await tokenizedBallotContract.deployTransaction.wait();

  console.log(
    `MisajiTokenizedBallot contract deployed at ${tokenizedBallotContract.address} address at block ${tokenizedBallotContractTxR.blockNumber}.`
  );

  return { tokenizedBallotContract };
}

const wallet = ethers.Wallet.fromMnemonic(
  "bullet skin travel beyond sugar square three cable endorse female comfort cancel"
);
const provider = new ethers.providers.InfuraProvider(
  "maticmum",
  "60d820eb6de947a3a80e00585a91d68d"
);
const signer = wallet.connect(provider);

deployContracts(signer);
