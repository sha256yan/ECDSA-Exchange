const express = require('express');
const app = express();
const cors = require('cors');
const secp = require("@noble/secp256k1");
const { ethers } = require("ethers");
const port = 3042;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());


/*--------------------------  THE FOLLOWING BLOCK WILL LOG A RANDOMLY GENERATED BALANCES OBJ TO THE CONSOLE      --------------------------------*/

/*
const SAMPLE_INITIAL_BALANCE = 100;
const NUM_ADDRESSES = 3;



function getSampleBalance() {
  const addresses = getRandomAddresses();

  const sampleBalance = {};
  addresses.map(pubKey => sampleBalance[pubKey] = SAMPLE_INITIAL_BALANCE);

  return sampleBalance;
}


function getRandomAddresses() {
  const publicKeyArray = [];
  for(let i = 0; i < NUM_ADDRESSES; i++) {
    publicKeyArray.push(getRandomAddress());
  }
  return publicKeyArray;

}


function getRandomAddress() {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  const publicKeyHex = `0x${secp.utils.bytesToHex(publicKey).slice(0,40)}`;
  const address = ethers.utils.getAddress(publicKeyHex);
  return address;
}

console.log(getSampleBalance());
*/

/*----------------------------------------------------------------------------------------------------------------------------------------------------*/

const balances = {
  '0x040D9B84dA124C1Cf7E5a3056F9453B429c37849': 100,
  '0x04081dCc6BBE0Ee7ebF396e3fEEb05c4153aEF45': 100,
  '0x04012bC51ae7ba5890B8754B2F0d899984581FBd': 100
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});




app.listen(port, () => {
  console.log(`Listening on port ${port}!`);


});





