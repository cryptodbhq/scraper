// these should be the only three dependencies that you use
const axios = require('axios').default;
const fs = require('fs');
const simpleGit = require('simple-git');

const sampleAsset = {
  // you can fetch this via the filesystem on /blockchains/bitcoin/info.json
  // https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/info.json 
  symbol: 'btc', 
  name: "Bitcoin", 
  network: "bitcoin", 

    // you can fetch this via the filesystem on /blockchains/bitcoin where 
    // in case of layer 1s the name of the /blockchains/${network_id} is the network id
    // in case of tokens its under /blockchains/${network_id}/assets/${asset_id}}
  // https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/info.json
  trustwallet_id: 'bitcoin',

  // https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=656d22b9-4755-4de2-84cc-929af07903ab
  coinmarketcap_id: 1, 
  
  // https://pro-api.coingecko.com/api/v3/coins/list
  coingecko_id: 'bitcoin', 

  // https://min-api.cryptocompare.com/data/all/coinlist
  crypto_compare_id: 1182,

  //** This is null as bitcoin is the native asset
  // of a network and not a token within a network 
  // you can see this in the trustwallet assets repository because it is in the token 
  // within blockchains/${network_id}/info.json and 
  // NOT within blockchains/${network_id}/assets/${token_id}/info.json
  // https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/info.json 
  contract_address: null, 
  
  // https://api.copper.co/platform/currencies
  copper_supported: true
};

async function main() {
  // make sure that you have git installed in your computer
  const git = simpleGit({
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
  });

  try {
    console.log("Running script.")
    // this is done so that the subsequent clone works the next time you run the script
    if(!fs.existsSync(__dirname + '/assets')) {
        console.log("You have not run this before. It will take a few minutes to download the https://github.com/trustwallet/assets repository and will take 300mb. This is only required for the first time.")

        // example on how to clone the repo
        await git.clone('https://github.com/trustwallet/assets.git', __dirname +'/assets', '--progress')
        console.log(`cloned trustwallet assets: ${fs.existsSync(__dirname + '/assets')}`);
    }


    // example on using 'fetch' to get API details
    const bitcoinInfo = await axios.get('https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/info.json')
    
    // populating sample CSV
    let exportCsv = '';
    const header = Object.keys(sampleAsset).join(",") + "\n";
    exportCsv += header;
    exportCsv += Object.values(sampleAsset);

    
    if(fs.existsSync(__dirname + '/results.csv')) {
      // deleting results.csv if it already exists
      fs.unlinkSync(__dirname + '/results.csv');
    }

    // output example
    fs.writeFileSync('results.csv', exportCsv);
    console.log("All done 🤞. See results.csv");
  } catch (error) {
    console.error("Example script failed", error)
  }
}

main();
