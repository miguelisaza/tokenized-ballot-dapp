import styles from "../styles/InstructionsComponent.module.css";
import { useState, useEffect } from "react";
import { useSigner, useSignMessage } from "wagmi";
import { useFetch } from "../hooks/useFetch";
import { WalletInfo } from "./WalletInfo";
import { ProposalsInfo } from "./ProposalsInfo";
import { RequestTokens } from "./RequestTokens";
import { Voting } from "./Voting";

export default function InstructionsComponent() {
  const [proposals, setProposals] = useState([]);
  const [messageToSign, setMessageToSign] = useState("");
  const { data: signer } = useSigner();
  const {
    signMessage,
    data: signature,
    isSuccess,
  } = useSignMessage({
    message: messageToSign,
  });

  const { doFetch: requestSignature } = useFetch("POST", "request-signature");
  const { doFetch: getProposals, proposalsLoading } = useFetch(
    "GET",
    "proposals"
  );

  const loadProposals = () => {
    getProposals().then((response) => {
      setProposals(response.proposals);
    });
  };

  useEffect(() => {
    loadProposals();
  }, []);

  useEffect(() => {
    if (signer) {
      requestSignature({ address: signer._address }).then((response) => {
        setMessageToSign(response.messageToSign);
      });
    }
  }, [signer]);

  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <h1>Voting dApp</h1>
      </header>

      <div className={styles.buttons_container}>
        {signer ? (
          <>
            <WalletInfo
              signer={signer}
              signMessage={signMessage}
              validated={isSuccess}
            />
            {isSuccess && (
              <>
                <ProposalsInfo
                  proposals={proposals}
                  isLoading={proposalsLoading}
                />
                <RequestTokens
                  signer={signer}
                  signature={signature}
                  isSuccess={isSuccess}
                />
                <Voting
                  proposals={proposals}
                  signer={signer}
                  signature={signature}
                  isSuccess={isSuccess}
                  reloadProposals={loadProposals}
                />
              </>
            )}
          </>
        ) : (
          <h1>Connect your wallet to begin.</h1>
        )}
      </div>
    </div>
  );
}
