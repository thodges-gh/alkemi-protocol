const Token = artifacts.require("TokenMock.sol");
const AlkemiNetwork = artifacts.require("AlkemiNetwork.sol");

const config = require("./config.json");

/*
  This script is meant to assist with creating a 
  liquidity reserve. It will deploy an ERC20 token, 
  a mock for the LINK Token and will make a call to 
  the Alkemi Network contract to create a reserve.
*/

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
const dayTime = 24 * 3600;
const now = Math.floor(Date.now() / 1000);
const lockingPeriod = now + dayTime;

module.exports = async function(callback) {
  try {
    if(config.token == '') {
      console.log("Specify an erc20 asset address in the config file");
      return;
    }
    const erc20Token = await Token.at(config.token);

    if(config.link == '') {
      console.log("Specify LINK token address in the config file");
      return;
    }
    const linkToken = config.link;
    
    const alkemiNetwork = await AlkemiNetwork.deployed();

    console.log("Alkemi Network: ", alkemiNetwork.address);
    const tx = await alkemiNetwork.createLiquidityReserve(
        linkToken,
        ZERO_ADDR,
        erc20Token.address,
        lockingPeriod,
        config.lockingPrice,
        config.pricePosition
    );

    callback(tx.tx);
  }
  catch(err) {
    callback(err);
  }
  
}
