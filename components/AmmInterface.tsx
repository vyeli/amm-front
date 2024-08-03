"use client";

import Navbar from "@/components/navbar";
import TokenInput from "@/components/TokenInpunt";
import Modal from "@/components/Modal";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Swap from "../contracts/swap.json";
import SeedInput from "./SeedInput";

import { swap } from "../server-actions";
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function AmmInterface() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const showModal = () => setShowPopUp(true);
  const hideModal = () => setShowPopUp(false);
  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        // Initialize contract
        const contractAddress = Swap.address;
        const contractABI = Swap.ABI;
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer,
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  return (
    <div>
      <Navbar account={account} />
      <div className="container mx-auto p-4">
        {account ? (
          <div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <form className="mb-4" action={swap}>
                <input
                  hidden
                  defaultValue={account}
                  name="account"
                  type="text"
                  id="account"
                />
                <TokenInput token="WETH" name="originalToken" />
                <TokenInput token="JBTKN" name="destinationToken" />
                <SeedInput name="seed" />
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    swap
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
