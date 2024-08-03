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

  const handleSwap = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = formData.get("originalTokenValue") as string;
    const originalToken = formData.get("originalTokenToken") as string;

    let sig;
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // These values should come from your contract or be passed as parameters
        const chainId = (await provider.getNetwork()).chainId;
        const tokenName = "Test AMM Token2";
        const contractAddress = "0x5A56FCc34C0c4A76D2E91d8640Da6898aD44038A"; // Replace with your contract address
        const tokenVersion = "1";

        // Create contract instance to get nonce
        const tokenAbi = [
          {
            constant: true,
            inputs: [],
            name: "name",
            outputs: [
              {
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                name: "_spender",
                type: "address",
              },
              {
                name: "_value",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                name: "_from",
                type: "address",
              },
              {
                name: "_to",
                type: "address",
              },
              {
                name: "_value",
                type: "uint256",
              },
            ],
            name: "transferFrom",
            outputs: [
              {
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [
              {
                name: "",
                type: "uint8",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [
              {
                name: "_owner",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                name: "balance",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "symbol",
            outputs: [
              {
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                name: "_to",
                type: "address",
              },
              {
                name: "_value",
                type: "uint256",
              },
            ],
            name: "transfer",
            outputs: [
              {
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [
              {
                name: "_owner",
                type: "address",
              },
              {
                name: "_spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            payable: true,
            stateMutability: "payable",
            type: "fallback",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                name: "spender",
                type: "address",
              },
              {
                indexed: false,
                name: "value",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                name: "value",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
        ];
        const tokenContract = new ethers.Contract(
          contractAddress,
          tokenAbi,
          provider,
        );
        console.log(tokenContract);
        const nonce = await provider.getTransactionCount(
          tokenContract.getAddress(),
        );
        // Prepare permit data
        const domain = {
          name: tokenName,
          version: tokenVersion,
          chainId: chainId,
          verifyingContract: contractAddress,
        };

        const types = {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        };
        const values = {
          owner: address,
          spender: await contract?.getAddress(), // Replace with the spender's address
          value: ethers.parseEther(value), // Amount to approve
          nonce: nonce,
          deadline: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        };

        // Sign the permit
        const signature = await signer.signTypedData(domain, types, values);

        // Split the signature
        sig = signature;
      } catch (error) {
        console.error(error);
      }
      console.log(sig);
    }
  };
  return (
    <div>
      <Navbar account={account} />
      <div className="container mx-auto p-4 w-1/2">
        {account ? (
          <div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <form className="mb-4" onSubmit={handleSwap}>
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
