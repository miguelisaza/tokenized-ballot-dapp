import styles from "../styles/InstructionsComponent.module.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi } from "../abis/MisajiTokenizedBallot.json";

import { useFetch } from "../hooks/useFetch";

const BALLOT_CONTRACT_ADDR = "0xcAEfecF8B559E9559cB2323a3a365e686C036537";

export const Voting = ({
  isSuccess = false,
  signer,
  proposals,
  reloadProposals,
}) => {
  const [votes, setVotes] = useState("");
  const [voteReceipt, setVoteReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userVoted, setUserVoted] = useState(false);
  const {
    doFetch: requestPower,
    response: txData,
    isLoading: tokenRequestLoading,
  } = useFetch("POST", "request-power");

  const ballotContract = new ethers.Contract(BALLOT_CONTRACT_ADDR, abi, signer);

  const { doFetch: requestAvailableVotes } = useFetch(
    "GET",
    `available-votes/${signer?._address}`
  );

  const requestVotingPower = () => {
    requestPower();
  };

  const vote = async (n) => {
    setLoading(true);

    try {
      const vote = ethers.utils.parseEther("1");

      const voteTx = await ballotContract.vote(n, vote);
      const voteReceiptR = await voteTx.wait();

      setVoteReceipt(voteReceiptR.transactionHash);
      setUserVoted(true);
      setLoading(false);

      reloadProposals();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      requestAvailableVotes().then((response) => {
        setVotes(response.availableVotes);
      });
    }
  }, [isSuccess, userVoted, signer]);

  if (txData)
    return (
      <div>
        <p>Tx complete!</p>
        <a
          href={`https://mumbai.polygonscan.com/tx/${txData.hash}`}
          target="_blank">
          See in explorer: {txData.hash}
        </a>
      </div>
    );

  if (userVoted)
    return (
      <>
        <h3>Thanks for voting!</h3>
        <a
          href={`https://mumbai.polygonscan.com/tx/${voteReceipt}`}
          target="_blank">
          See your vote in explorer: {voteReceipt}
        </a>
      </>
    );

  if (loading || tokenRequestLoading) return <h3>Loading...</h3>;

  return (
    <>
      <div>
        <h1>Vote</h1>
        {votes > 0 ? (
          <>
            <p>You have {votes} votes available! </p>
            {proposals.map((proposal, i) => (
              <button
                key={`${proposal.proposalName}_${proposal.votes}`}
                className={styles.button}
                onClick={() => {
                  vote(i);
                }}>
                Vote For {proposal.proposalName}
              </button>
            ))}
          </>
        ) : (
          <>
            <p>You don't have any voting power, please request it below</p>
            <button
              className={styles.button}
              onClick={() => {
                requestVotingPower();
              }}>
              Request Voting Power
            </button>
          </>
        )}
      </div>
    </>
  );
};
