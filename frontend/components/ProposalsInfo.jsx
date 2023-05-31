import React, { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

export const ProposalsInfo = ({ proposals, isLoading }) => {
  if (!isLoading)
    return (
      <>
        <h3>Proposal Ballot</h3>
        <table>
          <thead>
            <tr>
              <th>Proposal Name</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr key={`${proposal.proposalName}_${proposal.votes}`}>
                <td>{proposal.proposalName}</td>
                <td>{proposal.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );

  return (
    <>
      <h2>Loading Voting Status...</h2>
    </>
  );
};
