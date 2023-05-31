
# Tokenized Ballot App Frontend
![image](https://github.com/miguelisaza/tokenized-ballot-dapp/assets/18253315/2ff48c74-cbc1-4a98-926a-7131d8eedb96)


## Installation

```bash
$ yarn install
```

## Running the app

```bash

# watch mode
$ yarn dev

```

This will run the server in http://localhost:3000/

## Contract Addresses:
You should set up the following contract addresses in your environment file in order to make the backend work:
```
Ballot: 0xcAEfecF8B559E9559cB2323a3a365e686C036537
Vote Token: 0xcAEfecF8B559E9559cB2323a3a365e686C036537
```

These contracts are deployed in Polygon Mumbai Test network. 

## Features
- Display Wallet Address
- Connect to wallet using RaimbowMe Button
- Request tokens and voting power using buttons
- Table displaying the ballot voting status
- Vote buttons for each proposals
- Link with Transactions hashes of each done transaction
