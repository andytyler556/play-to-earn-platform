const { generateWallet, getStxAddress } = require('@stacks/wallet-sdk');
const { StacksTestnet } = require('@stacks/network');

const mnemonic = "vessel alert business involve shoulder punch rescue stem charge peanut gentle cup omit dragon clerk tumble sight toast false milk obtain curious fatal toss";

async function getPrivateKey() {
  try {
    const wallet = await generateWallet({
      secretKey: mnemonic,
      password: '',
    });
    
    const account = wallet.accounts[0];
    const network = new StacksTestnet();
    const address = getStxAddress({ account, network });
    
    console.log('Address:', address);
    console.log('Private Key:', account.stxPrivateKey);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

getPrivateKey();
