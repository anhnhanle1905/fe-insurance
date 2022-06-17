import { React, useState, useEffect } from "react";

import { ethers } from "ethers";
import BuyForm from "./components/BuyForm/index";
import History from "./components/History/index";
import { getCurrentWalletConnected } from "./utils/interact";
import "./App.scss";

function App() {
  const [haveMetamask, sethaveMetamask] = useState(true);

  const [accountAddress, setAccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const [isConnected, setIsConnected] = useState(false);
  const [isChangeWallet, setIsChangeWallet] = useState(false);

  const { ethereum } = window;

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccountAddress(accounts[0]);
          // setIsConnected(false);
          connectWallet();
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

      setAccountAddress(accounts[0]);

      setAccountBalance(bal);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
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
