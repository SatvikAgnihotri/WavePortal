const main = async () => {
  
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  //Set up necessary files in artifcats directory 
  const waveContract = await waveContractFactory.deploy({
    // deploy the contract and send it 0.1 eth from my address
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await waveContract.deployed();
  //wait till confirmed 
  console.log('Contract addy:', waveContract.address);
  //log the Contract address in the console

  
  /* Get Contract balance */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  /*
   * Show Contract balance to verify there is money in the contract
   */
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );
  
    /* Send test waves */
    const waveTxn = await waveContract.wave('This is wave #1');
    await waveTxn.wait();
  
    const waveTxn2 = await waveContract.wave('This is wave #2');
    await waveTxn2.wait();
  

   /*
   * See if the contracts balance updated after sending a wave.
   */
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
  };

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();