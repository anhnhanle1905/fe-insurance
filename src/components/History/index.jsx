import { React, useState } from "react";
import { ethers } from "ethers";
import "./styles.scss";
import INSURANCE_ABI from "../../abi/INSURANCE_ABI";
import swal from "sweetalert";
/* global BigInt */

History.propTypes = {};

function History(props) {
  const { accountAddress, isConnected } = props;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const INSURANCE_ADDRESS = "0x2BA6E36075eF5fA34527763e98cd4b54fe309F97";
  const INSURANCE_CONTRACT = new ethers.Contract(
    INSURANCE_ADDRESS,
    INSURANCE_ABI,
    signer
  );

  const getInsurance = async () => {
    const insurances = await INSURANCE_CONTRACT.callStatic.getAllInsurance();

    console.log(insurances);
  };

  return;
  <div className="history">
    <h2>ok</h2>
  </div>;
}

export default History;
