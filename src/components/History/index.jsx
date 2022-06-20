import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import "./styles.scss";
import INSURANCE_ABI from "../../abi/INSURANCE_ABI";
import swal from "sweetalert";
/* global BigInt */

History.propTypes = {};

function History(props) {
  const { accountAddress, isConnected, isChangeWallet } = props;

  let user = {
    id: "0",
    info: "",
  };
  const [newInsurances, setNewInsurances] = useState(null);
  const [newInsurancesForAddress, setNewInsurancesForAddress] = useState(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const INSURANCE_ADDRESS = "0x2BA6E36075eF5fA34527763e98cd4b54fe309F97";
  const INSURANCE_CONTRACT = new ethers.Contract(
    INSURANCE_ADDRESS,
    INSURANCE_ABI,
    signer
  );

  useEffect(() => {
    getInsurance();
  }, [isConnected, isChangeWallet]);
  const getInsurance = async () => {
    const insurances = await INSURANCE_CONTRACT.callStatic.getAllInsurance();
    const newInsurancesData = insurances.map((val, index) => {
      user = {
        id: index + 1,
        info: val,
      };
      return user;
    });

    const newInsurancesDataForAddress = newInsurancesData.filter((val) => {
      return val.info.owner.toLowerCase() == `${accountAddress}`.toLowerCase();
    });

    setNewInsurances(newInsurancesData); //data for all user
    setNewInsurancesForAddress(newInsurancesDataForAddress); //data for address
  };
  // const formatTimestampToDate = (date) => {
  //   const newDate = new Date(date);
  //   newDate.toISOString();
  //   return newDate;
  // };

  return (
    <div className="history">
      <h1>History</h1>
      {isConnected ? (
        <div className="history-table ">
          <div className="id colum">
            <div className="id-title title">
              <p>Id</p>
            </div>
            <div className="id-details">
              {newInsurancesForAddress ? (
                newInsurancesForAddress.map((val, index) => (
                  <p key={index}>{val.id}</p>
                ))
              ) : (
                <p>???</p>
              )}
            </div>
          </div>

          <div className="contract-value colum">
            <div className="contract-value-title title">
              <p>Contract Value</p>
            </div>
            <div className="contract-value-details">
              {newInsurancesForAddress ? (
                newInsurancesForAddress.map((val, index) => (
                  <p key={index}>{parseInt(val.info.deposit) / 10 ** 18}</p>
                ))
              ) : (
                <p>???</p>
              )}
            </div>
          </div>

          <div className="buy-price colum">
            <div className="buy-price-title title">
              <p>Buy Price</p>
            </div>
            <div className="buy-price-details">
              {newInsurancesForAddress ? (
                newInsurancesForAddress.map((val, index) => (
                  <p key={index}>
                    {parseInt(val.info.current_price) / 10 ** 18}
                  </p>
                ))
              ) : (
                <p>???</p>
              )}
            </div>
          </div>

          <div className="liquidation-price colum">
            <div className="liquidation-price-title title">
              <p>Liquidation Price</p>
            </div>
            <div className="liquidation-price-details">
              {newInsurancesForAddress ? (
                newInsurancesForAddress.map((val, index) => (
                  <p key={index}>
                    {parseInt(val.info.liquidation_price) / 10 ** 18}
                  </p>
                ))
              ) : (
                <p>???</p>
              )}
            </div>
          </div>

          <div className="expire colum">
            <div className="expire-title title">
              <p>Expire Time</p>
            </div>
            <div className="expire-details">
              {newInsurancesForAddress ? (
                newInsurancesForAddress.map((val, index) => (
                  <p key={index}>
                    {new Date(
                      parseInt(val.info.expire) * 1000
                    ).toLocaleString()}
                  </p>
                ))
              ) : (
                <p>???</p>
              )}
            </div>
          </div>

          <div className="state colum">
            <div className="state-title title">
              <p>State</p>
            </div>
            <div className="state-details">
              {newInsurancesForAddress ? (
                newInsurancesForAddress.map((val, index) => (
                  <p key={index}>{val.info.state}</p>
                ))
              ) : (
                <p>???</p>
              )}
            </div>
          </div>

          <div className="owner colum">
            <div className="owner-title title">
              <p>Owner</p>
            </div>
            <div className="owner-details">
              {newInsurancesForAddress ? (
                newInsurancesForAddress.map((val, index) => (
                  <p key={index}>
                    {val.info.owner.slice(0, 4)}
                    ...
                    {val.info.owner.slice(38, 42)}
                  </p>
                ))
              ) : (
                <p>???</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default History;
