const express = require('express');
const app = express();
const cors = require('cors');
const secp = require("@noble/secp256k1");
const { send } = require('process');
const port = 3042;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());


/*--------------------------  GENERATES RANDOM PRIVATE KEYS AND CREATES CHECKSUMED ADDRESSES  --------------------------------*/


const SAMPLE_INITIAL_BALANCE = 100;
const NUM_ADDRESSES = 3;



function getSampleBalance() {
  const {addressArray, privateKeys} = getRandomAddresses();

  const accounts = {};
  addressArray.map(pubKey => accounts[pubKey] = SAMPLE_INITIAL_BALANCE);

  return {privateKeys, accounts};
}


function getRandomAddresses() {
  const addressArray = [];
  const privateKeys = [];

  for(let i = 0; i < NUM_ADDRESSES; i++) {
    let {address, privateKey}  = getRandomAddress();
    addressArray.push(address);
    privateKeys.push(privateKey);
  }
  return {addressArray, privateKeys};

}

function getRandomAddress() {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  const publicKeyHex = `0x${secp.utils.bytesToHex(publicKey).slice(0,40)}`;
  const privateKeyHex = `0x${secp.utils.bytesToHex(privateKey)}`
  return {address: publicKeyHex, privateKey: privateKeyHex};
}

/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
const {accounts, privateKeys} = getSampleBalance();
const balances = accounts;
console.log("\n\nAccounts:\n", balances);
console.log("\n\nPrivate keys:\n", privateKeys);




app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, privKey} = req.body;
  const privateKey = hexToBytes(privKey);
  const publicKey =  `0x${secp.utils.bytesToHex(secp.getPublicKey(privateKey)).slice(0,40)}`;

  console.log(publicKey, sender);




  const isValid = publicKey === sender;
  if(isValid) {
    balances[sender] -= parseInt(amount);
    balances[recipient] = (balances[recipient] || 0) + parseInt(amount);
    res.send({ balance: balances[sender], error: "Success!" });
  }
  else {
    res.send({balance: balances[sender], error:"Invalid transaction."})
  }

  
});



function hexToBytes(hexSeq) {
  //WARNING: DOES NOT CHECK FOR ODD SIZED HEX SEQUENCE.
  const seq = hexSeq.slice(2);
  const bytes = new Uint8Array(32);
  for(let i = 0; i < hexSeq.length - 2; i += 2) {
      let hex = seq.slice(i, i + 2);
      let byte = parseInt(seq.slice(i, i + 2), 16);
      bytes[parseInt(i/2)] = byte;
  }
  return bytes;
}




app.listen(port, () => {
  console.log(`Listening on port ${port}!`);


});





