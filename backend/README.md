
# Tokenized Ballot App Backend


## Installation

```bash
$ yarn install
```

## Running the app

```bash

# watch mode
$ yarn run start:dev

```

This will run the server in http://localhost:3001/

## Contract Addresses:
You should set up the following contract addresses in your environment file in order to make the backend work:
```
Ballot: 0xcAEfecF8B559E9559cB2323a3a365e686C036537
Vote Token: 0xcAEfecF8B559E9559cB2323a3a365e686C036537
```

These contracs are deployed in Polygon Mumbai Test network.

The Tokenized Ballot contract was modified to allow unlimited votes without limit block number and also to get the total amount of proposals.

## Endpoints:
The endpoints can be accessed through the Swagger UI pluging using the http://localhost:3001/api browser route.

- GET /total-supply
  - Gets the total vote token supply
- GET /balance/{address}
  - Gets the token balance of an address
- GET /proposals
  - Gets the decoded proposals and votes from the ballot contract.
- GET /available-votes/{address}
  - Gets available votes (voting power) of the given address.

- POST /request-signature
  - Given the "address" body param, it returns a nonce phrase to be signed
- POST /authenticate-signature
  - Given the "address" and "signedMessage" body params, it returns a boolean if the signature is valid
- POST /request-token
  - Given the "toAddress" and "signature" body params, it mints a token to the given signed address, the signature should the signed version of the nonce phrase given on /request-signature
- POST /request-power
  - Given the "toAddress" and "signature" body params, it delegates voting power to the given signed address, the signature should the signed version of the nonce phrase given on /request-signature


