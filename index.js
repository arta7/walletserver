
// var  Db = require('./dboperation');
// // var  Order = require('./Order');
// var  express = require('express');
// var  bodyParser = require('body-parser');
// var  cors = require('cors');
// // const sql = require('mssql')



// var  app = express();
// var  router = express.Router();

// app.use(bodyParser.urlencoded({ extended:  true }));
// app.use(bodyParser.json());
// app.use(cors());
// app.use('/api', router);

// router.use((request, response, next) => {
//     try
//     {
//     console.log('middleware');
//     next();
//     }
//     catch(error)
//     {
//         console.log('response : ',response.status(400).json(null))
//         console.log('err : ',error)
//     }
// })
   
//   router.route('/AddUsers').post((r, response) => {
//     let  order = { ...r }
//     Db.AddUsers(order,r, response).then((data) => {
//         // console.log('response',data)
//         console.log('response',response,'data : ',data)
//     }).catch((error)=>{
//       response.status(400).json(null)
//         console.log('error : ',error)
//     })
//   })


//   router.route('/UpdateUsers').post((r, response) => {
//     let  order = { ...r }
//     Db.UpdateUsers(order,r, response).then((data) => {
//         // console.log('response',data)
//         console.log('response',response,'data : ',data)
//     }).catch((error)=>{
//       response.status(400).json(null)
//         console.log('error : ',error)
//     })
//   })
//   router.route('/CheckUserLogin').post((r, response) => {
//     let  order = { ...r }
//     Db.CheckUserLogin(order,r, response).then((data) => {
//         // console.log('response',data)
//         console.log('response',response,'data : ',data)
//     }).catch((error)=>{
//       response.status(400).json(null)
//         console.log('error : ',error)
//     })
//   })


//   // router.route('/UpdateUsers').post((request, response) => {
//   //   let  order = { ...request.body }

//   //   console.log('order',order)

//   //   Db.UpdateCountersProducts(order).then(data  => {
//   //     response.status(200).json(data);
//   //   }).catch((error)=>{
//   //     console.log('error ',error)
//   //   })
//   // })
   
//   var port = 8090;
//   app.listen(port);
//   console.log('Order API is runnning at ' + port);

// const bip39 = require('bip39');
// const crypto = require('crypto');
// const elliptic = require('elliptic');

// function generateKeyPairFromMnemonic(mnemonic) {
//   // Derive a seed from the mnemonic phrase
//   const seed = bip39.mnemonicToSeedSync(mnemonic);

//   // Create an elliptic curve key pair
//   const ec = new elliptic.ec('secp256k1');
//   const keyPair = ec.genKeyPair({
//     entropy: seed.slice(0, 32), // Take the first 32 bytes of the seed for entropy
//   });

//   return {
//     privateKey: keyPair.getPrivate('hex'),
//     publicKey: keyPair.getPublic('hex'),
//   };
// }

// // Example usage
// const mnemonic = 'moment sound mesh advice bunker bone trumpet weather love expire attract zoo';
// const keyPair = generateKeyPairFromMnemonic(mnemonic);
// console.log('Private Key:', keyPair.privateKey);
// console.log('Public Key:', keyPair.publicKey);


// function generateRandomMnemonic() {
//   // Generate a random 256-bit (32-byte) entropy
//   const entropy = crypto.randomBytes(32);

//   // Convert the entropy to a mnemonic phrase
//   const mnemonic = bip39.entropyToMnemonic(entropy);

//   return mnemonic;
// }

// function generateKeyPairFromMnemonic(mnemonic) {
//   // Derive a seed from the mnemonic phrase
//   const seed = bip39.mnemonicToSeedSync(mnemonic);

//   // Generate key pair from the seed
//   const keyPair = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 2048,
//     publicKeyEncoding: {
//       type: 'spki',
//       format: 'pem',
//     },
//     privateKeyEncoding: {
//       type: 'pkcs8',
//       format: 'pem',
//     },
//     seed,
//   });

//   return keyPair;
// }

// function getAddress(publicKey) {
//     const addressHash = crypto.createHash('sha256').update(publicKey).digest('hex').slice(-30);
//     return `csc.${addressHash}`
// }

// function signTransaction(transaction, privateKey) {
//     const dataToSign = JSON.stringify(transaction);

//     // Sign the data correctly
//     const sign = crypto.createSign('sha256');
//     sign.update(JSON.stringify(transaction));
//     const signature = sign.sign(privateKey, 'base64');

//     return signature;
// }

// const mnemonic = 'moment sound mesh advice bunker bone trumpet weather love expire attract zoo';
//     const keypair = generateKeyPairFromMnemonic(mnemonic);
//     const address = getAddress(keypair.publicKey);

//     console.log("Generated address: ", address);

// const ethers = require('ethers');

// async function init() {
//     //creating new random mnemonic
//     //const mnemonic = await ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
//     const mnemonic = 'moment sound mesh advice bunker bone trumpet weather love expire attract zoo';

//     //mnemonic to private, public key and address
//     const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic);
//     const privateKey = wallet.privateKey;
//     const publicKey = wallet.publicKey
//     console.log('privateKey',privateKey)
//     console.log('publicKey',publicKey)
// }
// init();
// "0x3cB73bFBEf564Dd5c6a119099D2455ea20C79346";



const axios = require('axios')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const fs = require('fs')
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip32 = BIP32Factory(ecc);

const parallelLimit = 10
const iterations = 100
const batchSize = 10
const delayBetweenBatches = 5000 // 5 seconds
const apiDelay = 3000 // 3 seconds
let useBlockchainInfoAPI = true




async function main() {
  const walletPromises = []

  for (let i = 0; i < iterations; i++) {
    walletPromises.push(generateWallet())

    if (walletPromises.length === parallelLimit) {
      await processBatch(walletPromises)
      walletPromises.length = 0
    }
  }

  if (walletPromises.length > 0) {
    await processBatch(walletPromises)
  }
}

async function processBatch(walletPromises) {
  const results = await Promise.all(walletPromises);

  const activeAddresses = results
    .filter(({ hasTransactions }) => hasTransactions)
    .map(({ address }) => address);

  if (activeAddresses.length > 0) {
    const dataToSave = activeAddresses.join('\n') + '\n';
    appendToFile('active_addresses.txt', dataToSave);
  }
  await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
}


async function generateWallet() {
  // Generate a new 12-word mnemonic seed phrase
  const mnemonic = "click stomach dash shuffle spawn car genuine grace valve ticket assist luggage" //bip39.generateMnemonic(128)
  console.log('Mnemonic:', mnemonic)

  // Convert the mnemonic to a seed
  const seed = await bip39.mnemonicToSeed(mnemonic)
  console.log('seed:', seed)
  // Derive the wallet from the seed using BIP32
  const network = bitcoin.networks.bitcoin
  const hdMaster = bip32.fromSeed(seed, network);
  //bitcoin.bip32.fromSeed(seed, network);
  const account = hdMaster.derivePath("m/44'/0'/0'/0")

  // Generate a new Bitcoin address
  const { address } = bitcoin.payments.p2pkh({
    pubkey: account.derive(0).publicKey,
    network
  })

  console.log('Bitcoin Address:', address)
  const hasTransactions = await checkAddressActivity(address)
  await new Promise(resolve => setTimeout(resolve, apiDelay))
  return { address, hasTransactions }
}


async function checkAddressActivity(address) {
  try {
    let response
    if (useBlockchainInfoAPI) {
      response = await axios.get(`https://blockchain.info/rawaddr/${address}`)
    } else {
      response = await axios.get(
        `https://api.blockcypher.com/v1/btc/main/addrs/${address}`
      )
    }

    // Toggling between APIs to manage rate limits
    useBlockchainInfoAPI = !useBlockchainInfoAPI

    let hasTransactions = false

    // Checking transaction presence
    if (response.data.txs) {
      hasTransactions = response.data.txs.length > 0
    } else if (response.data.txrefs) {
      hasTransactions = response.data.txrefs.length > 0
    }

    // Logging based on transaction status
    if (hasTransactions) {
      console.log('This address has transactions associated with it.')
      return true
    } else {
      console.log('This address has no transactions associated with it.')
      return false
    }
  } catch (error) {
    console.error('Error fetching address data:', error.message)
    return false
  }
}

main();



