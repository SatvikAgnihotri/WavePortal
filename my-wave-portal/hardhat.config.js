require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      //DO NOT Commit the following to Github//
      url: 'https://eth-rinkeby.alchemyapi.io/v2/1u7UBdT_XaD8jr4OJLi-VupO7U20KA-i', 
      accounts: ['4e6d4d4b06c9d083ad52a010164387d0243c6af23745e5f9adba6b11e12d2d8e'],
    },
  },
};


//require('@nomiclabs/hardhat-waffle');

//module.exports = {
//  networks: {
//    rinkeby: {
//      url: 'YOUR ALCHEMY_API_URL',
//      accounts: ['YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY'],
//    },
//  },
//};