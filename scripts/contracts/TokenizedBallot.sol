// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IVoteToken {
    function getVotes(address) external view returns (uint256);
}

contract MisajiTokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IVoteToken public tokenContract;
    Proposal[] public proposals;

    mapping(address => uint256) public votingPowerSpent;

    constructor(bytes32[] memory proposalNames, address _tokenContract) {
        tokenContract = IVoteToken(_tokenContract);
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function getProposalsCount() public view returns (uint256) {
        return proposals.length;
    }

    function votingPower(address account) public view returns (uint256) {
        return tokenContract.getVotes(account) - votingPowerSpent[account];
    }

    function vote(uint proposal, uint amount) external {
        require(
            votingPower(msg.sender) >= amount,
            "Trying to vote more than allowed"
        );
        votingPowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winner() external view returns (Proposal memory winnerName_) {
        winnerName_ = proposals[winningProposal()];
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
