import styles from "../styles/InstructionsComponent.module.css";
import React, { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

export const RequestTokens = ({ isSuccess = false, signer, signature }) => {
  const [tokens, setTokens] = useState("");
  const {
    doFetch: requestToken,
    response: txData,
    isLoading: tokenRequestLoading,
  } = useFetch("POST", "request-token");

  const { doFetch: getBalance, isLoading: balanceLoading } = useFetch(
    "GET",
    `balance/${signer?._address}`
  );

  const requestTokens = async () => {
    await requestToken({
      toAddress: signer._address,
      signature,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      getBalance().then((response) => {
        setTokens(response.balance);
      });
    }
  }, [isSuccess, signer]);

  if (txData)
    return (
      <div>
        <p>Request complete!</p>
        <a
          href={`https://mumbai.polygonscan.com/tx/${txData.hash}`}
          target="_blank">
          See your new token mint in the explorer: {txData.hash}
        </a>
      </div>
    );

  if (tokenRequestLoading && balanceLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Request Tokens To Vote</h1>
      <p>You have {tokens} tokens available! </p>
      <button
        className={styles.button}
        disabled={!isSuccess}
        onClick={() => {
          requestTokens();
        }}>
        Request a Token
      </button>
    </div>
  );
};
