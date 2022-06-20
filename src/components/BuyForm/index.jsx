import { React, useState } from "react";
import { ethers } from "ethers";
import "./styles.scss";
import INSURANCE_ABI from "../../abi/INSURANCE_ABI";
import swal from "sweetalert";
import axios from "axios";
/* global BigInt */

BuyForm.propTypes = {};

function BuyForm(props) {
  const { accountAddress, isConnected } = props;

  const [input, setInput] = useState({
    _deposit: null,
    _current_price: null,
    _liquidation_price: null,
    _expire: null,
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const INSURANCE_ADDRESS = "0x2BA6E36075eF5fA34527763e98cd4b54fe309F97";
  const INSURANCE_CONTRACT = new ethers.Contract(
    INSURANCE_ADDRESS,
    INSURANCE_ABI,
    signer
  );

  const buyInsurance = async () => {
    // const volume = await INSURANCE_CONTRACT.callStatic.volume();
    try {
      // console.log(input);
      const rawTxn = await INSURANCE_CONTRACT.populateTransaction.buyInsurance(
        `${accountAddress}`,
        input._deposit,
        input._current_price,
        input._liquidation_price,
        input._expire,
        {
          value: input._deposit,
        }
      );

      let sendTxn = (await signer).sendTransaction(rawTxn);

      let buy = (await sendTxn).wait();

      if (buy) {
        //save data in BE
        const token = localStorage.getItem("accessToken");
        // console.log(`token: ${token}`);
        const res = await axios.post(
          `http://localhost:4000/api/insurance/buy-insurance`,
          {
            owner: `${accountAddress}`,
            current_price: formatWeiValueToPrice(input._current_price),
            liquidation_price: formatWeiValueToPrice(input._liquidation_price),
            deposit: formatWeiValueToPrice(input._deposit),
            expired: input._expire,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (res) {
          console.log(`Save data success at BE`);
        } else {
          console.log(`Error save data at BE`);
        }
        swal(
          "Buy success!" +
            "\n" +
            "Navigate to https://kovan.etherscan.io/tx/" +
            (await sendTxn).hash
        );
        console.log(
          " - Transaction is mined - " + "\n" + "Transaction Hash:",
          (await sendTxn).hash +
            "\n" +
            "Block Number: " +
            (await buy).blockNumber +
            "\n" +
            "Navigate to https://kovan.etherscan.io/tx/" +
            (await sendTxn).hash,
          "to see your transaction"
        );
      } else {
        console.log("Error submitting transaction");
        swal("Error submitting transaction");
      }
    } catch (error) {
      console.log("Error submitting transaction");
      swal(
        "Error submitting transaction" +
          "\n" +
          `Error: ${JSON.stringify(error)}`
      );
    }
  };

  const formatDate = (_date) => {
    let newDate = new Date(_date);
    return newDate.getTime() / 1000;
  };
  const formatPriceToWeiValue = (_num) => {
    return BigInt(_num * 10 ** 18);
  };
  const formatWeiValueToPrice = (_num) => {
    return Number(_num) / 10 ** 18;
  };

  return (
    <div className="buy-form">
      <div className="form">
        <h2 className="title">Buy Insurance</h2>
        {/* <div className="form-group">
          {isConnected ? (
            <p>Address user: {accountAddress} </p>
          ) : (
            <p>Address user: </p>
          )}
        </div> */}
        <div className="form-group">
          <label htmlFor="name">Giá trị hợp đồng</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Giá trị hợp đồng"
            className="deposit"
            onChange={(e) =>
              setInput({
                ...input,
                _deposit: formatPriceToWeiValue(e.target.value),
              })
            }
          />
          <span className="form-message"></span>
        </div>
        <div className="form-group">
          <label htmlFor="">Coin/Token</label>
          <select
            name="Buy-roomtype"
            className="coin"
            title="Coin/Token"
            data-header="Coin/Token"
          >
            <option value="ETH">ETH</option>
            {/* <option value="BTC">BTC</option>

            <option value="BNB">BNB</option> */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Giá mua</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Giá mua"
            className="current-price"
            onChange={(e) =>
              setInput({
                ...input,
                _current_price: formatPriceToWeiValue(e.target.value),
              })
            }
          />
          <span className="form-message"></span>
        </div>
        <div className="form-group">
          <label htmlFor="name">Giá thanh lý</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Giá thanh lý"
            className="liquidation-price"
            onChange={(e) =>
              setInput({
                ...input,
                _liquidation_price: formatPriceToWeiValue(e.target.value),
              })
            }
          />
          <span className="form-message"></span>
        </div>

        <div className="form-group">
          <label htmlFor="">Ngày hết hạn</label>
          <input
            id="email"
            name="email"
            type="date"
            placeholder="Ngày hết hạn"
            className="expire"
            onChange={(e) =>
              setInput({ ...input, _expire: formatDate(e.target.value) })
            }
          />
        </div>
        <button className="btn-buy" onClick={buyInsurance}>
          BUY
        </button>

        {/* <button className="btn-buy" onClick={getInsurance}>
          BUTTON TEST
        </button> */}
      </div>
    </div>
  );
}

export default BuyForm;
