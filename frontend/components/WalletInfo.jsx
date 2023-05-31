import styles from "../styles/InstructionsComponent.module.css";
import React from "react";

export const WalletInfo = ({ signer, signMessage, validated }) => {
  const validateAccount = () => {
    signMessage();
  };

  if (signer)
    return (
      <>
        <h3>Wallet address {signer?._address}</h3>
        {!validated && (
          <div>
            <h1>Validate Account</h1>
            <button
              className={styles.button}
              onClick={() => {
                validateAccount();
              }}>
              Sign to validate ownership!
            </button>
          </div>
        )}
      </>
    );
};
