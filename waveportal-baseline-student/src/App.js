import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /* allWaves state property to store all waves? */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x2f9a57191FD0BDC068aD496653C066Ce6F427c2D";
  const contractABI = abi.abi

  /* Gets all waves from contract */
  const getAllWaves = async () => {
    try {
      if (window.ethereum) {
        //Can try taking these out to see if it changes anything 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        /* Call the getAllWaves method from your Smart Contract */
        const waves = await wavePortalContract.getAllWaves();

        /* Picking out address, timestamp, and message for our UI */
        const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

        /* Store our data in React State */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* Listen in for emitter events */
  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log('NewWave', from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on('NewWave', onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
  }, []);


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorised account;", account)
        setCurrentAccount(account)
        getAllWaves();
      } else {
        console.log(`No authorised account found`)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        /* Ethers is a library between front end and contract. A provider is what you use to talk to Ethereum Nodes. Here we use MetaMask nodes in the background to send and recieve data from a deployed contract */
        /* Signers send information about a wallet to and from a contract to execute state changes, but can not preform actions on behalf of the wallet  */
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(tweetValue, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const [tweetValue, setTweetValue] = React.useState("")

  /* Use later to devise a way for people to send me Eth
    const sendmeETH = async () => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
  
        }
      }
    }
  */

  useEffect(() => {

    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">

        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Satvik, a 16 year old Developer. Connect your ethereum wallet (to Rinkeby) and wave at me + send a message!
        </div>

        <div className="bio">
          Want to learn more? Feel free to check out my <a href="https://twitter.com/SatvikAgnihotri">Twitter</a>, <a href="https://www.linkedin.com/in/satvik-agnihotri/">LinkedIn</a>, or <a href="https://satvik1.substack.com/">Newsletter</a>.
        </div>
        
        <textarea name="tweetArea"
                  placeholder="Type your message..."
                  type="text"
                  id="tweet"
                  value={tweetValue}
                  onChange={e => setTweetValue(e.target.value)} />
  
        <button className="waveButton" onClick={wave}> 
          Wave at me/Send a message
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "12px", color: "black" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

        <button className="waveButton" onClick={null}>
        Send Me ETH [DUD]
        </button>

      </div>
    </div>
  );
}

export default App