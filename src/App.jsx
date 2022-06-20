import { React, useState, useEffect } from "react";

import { ethers } from "ethers";
import BuyForm from "./components/BuyForm/index";
import History from "./components/History/index";
import axios from "axios";

import "./App.scss";

function App() {
  const [haveMetamask, sethaveMetamask] = useState(true);

  const [accountAddress, setAccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const [accessToken, setAccessToken] = useState("");

  const [isConnected, setIsConnected] = useState(false);
  const [isChangeWallet, setIsChangeWallet] = useState(false);

  const { ethereum } = window;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccountAddress(accounts[0]);
          // setIsConnected(false);
          connectWallet();
          getSignature();
          setIsChangeWallet(true);
        } else {
          setAccountAddress("");
        }
      });
    }
  }

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();
    addWalletListener();
    setIsChangeWallet(false);
  }, [accountAddress]);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);

      getSignature();
      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const getSignature = async () => {
    const message = "Sign this message!";
    let sign = await signer.signMessage(message);
    let accountSign = await signer.getAddress();
    console.log(`wallet address: ${accountSign}, 
    sign: ${sign}`);
    try {
      // make request to local server
      const { data } = await axios.post(
        `http://localhost:4000/api/insurance/user/log-in`,
        { walletAddress: accountSign, signature: sign },
        { withCredentials: true }
      );
      localStorage.setItem("accessToken", data);
      setAccessToken(data);
      console.log(`accessToken: ${localStorage.getItem("accessToken")}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="App">
      <h1>Insurance App</h1>
      <div className="connect-wallet">
        <div className="App-header">
          {haveMetamask ? (
            <div className="btn-connect">
              {isConnected ? (
                <p>
                  {accountAddress.slice(0, 4)}...
                  {accountAddress.slice(38, 42)}
                </p>
              ) : (
                <button className="btn" onClick={connectWallet}>
                  Connect
                </button>
              )}
              {isConnected ? (
                <div className="card">
                  <div className="card-row"></div>
                  <div className="card-row">
                    <span>Wallet Balance: {accountBalance}</span>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <p>Please Install Metamask</p>
          )}
        </div>
      </div>

      <BuyForm accountAddress={accountAddress} isConnected={isConnected} />
      <History
        accountAddress={accountAddress}
        isConnected={isConnected}
        isChangeWallet={isChangeWallet}
      />
    </div>
  );
}

export default App;
