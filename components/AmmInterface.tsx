"use client";
import Navbar from "@/components/navbar";
import TokenInput from "@/components/TokenInpunt";
import { useState, useEffect } from "react";
import { ethers, toBigInt } from "ethers";
import Swap from "../contracts/swap.json";
import Image from "next/image";
import PiLeftCore from "@/contracts/piLeftCore.json";
import { generateProof } from "../server-actions";
declare global {
  interface Window {
    ethereum?: any;
  }
}
interface GenerateProofInterface {
  nonce: number;
  amount1: number;
  amount2: number;
  token1: string;
  token2: string;
  sender: string;
}
interface TokenProps {
  tokenName: string;
  value: Number;
  id: string;
  address: string;
}

export default function AmmInterface() {
  const wethProps = {
    tokenName: "Wrapped Ether",
    value: 0,
    id: "WETH",
    address: "0x5300000000000000000000000000000000000004",
  };
  const JaibaTokenProps = {
    tokenName: "Test AMM Token2",
    value: 0,
    id: "TAMMT2",
    address: "0x5A56FCc34C0c4A76D2E91d8640Da6898aD44038A",
  };

  const [swapped, setSwapped] = useState<boolean>(false);
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

  const handleSwitch = () => {
    setSwapped(!swapped);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let token1: string;
    let token2: string;
    let amount1: number;
    let amount2: number;
    let sender: string;
    let nonce: number;
    const formData = new FormData(event.currentTarget);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      sender = await signer.getAddress();
      const contractAddress = PiLeftCore.address;
      const contractABI = PiLeftCore.abi;
      const coreContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider,
      );
      nonce = await provider.getTransactionCount(coreContract.getAddress());
    } catch (error) {
      console.error(error);
      nonce = 1;
      sender = "0x4e6a7fe260ef91899d41ec762f79b05f8e195932";
    }
    if (!swapped) {
      token1 = wethProps.address;
      token2 = JaibaTokenProps.address;
      amount1 = formData.get("originalTokenValue") as unknown as number;
      amount2 = formData.get("destinationTokenValue") as unknown as number;
    } else {
      token2 = wethProps.address;
      token1 = JaibaTokenProps.address;
      amount2 = formData.get("originalTokenValue") as unknown as number;
      amount1 = formData.get("destinationTokenValue") as unknown as number;
    }
    const payload: GenerateProofInterface = {
      token1,
      token2,
      amount1,
      amount2,
      nonce: nonce,
      sender: sender,
    };
    generateProof(payload);
  };
  return (
    <div>
      <Navbar account={account} />
      <div className="container mx-auto p-4 w-96">
        {account ? (
          <div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-4">
              <form className="mb-4" onSubmit={handleSubmit}>
                <div
                  className={`flex ${swapped ? "flex-col-reverse" : "flex-col"} items-center`}
                >
                  <TokenInput tokenProps={wethProps} name="originalToken" />
                  <div className="mb-2 mt-2">
                    <Image
                      src="/arrows.png"
                      width="80"
                      height="80"
                      alt="Interchange Original Token with Destination Token"
                      onClick={handleSwitch}
                    />
                  </div>
                  <TokenInput
                    tokenProps={JaibaTokenProps}
                    name="destinationToken"
                  />
                </div>
                <div className="flex items-center justify-center mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Generate Proof
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

// const handleSwap = async (event: React.FormEvent<HTMLFormElement>) => {
//   event.preventDefault();
//   const formData = new FormData(event.currentTarget);
//   const value = formData.get("originalTokenValue") as string;
//   const originalToken = formData.get("originalTokenToken") as string;
//
//   let sig;
//   if (typeof window.ethereum !== "undefined") {
//     try {
//       // Request account access
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const address = await signer.getAddress();
//
//       // These values should come from your contract or be passed as parameters
//       const chainId = (await provider.getNetwork()).chainId;
//       const tokenName = "Test AMM Token2";
//       const contractAddress = "0x5A56FCc34C0c4A76D2E91d8640Da6898aD44038A"; // Replace with your contract address
//       const tokenVersion = "1";
//
//       // Create contract instance to get nonce
//       const tokenAbi = [
//         {
//           constant: true,
//           inputs: [],
//           name: "name",
//           outputs: [
//             {
//               name: "",
//               type: "string",
//             },
//           ],
//           payable: false,
//           stateMutability: "view",
//           type: "function",
//         },
//         {
//           constant: false,
//           inputs: [
//             {
//               name: "_spender",
//               type: "address",
//             },
//             {
//               name: "_value",
//               type: "uint256",
//             },
//           ],
//           name: "approve",
//           outputs: [
//             {
//               name: "",
//               type: "bool",
//             },
//           ],
//           payable: false,
//           stateMutability: "nonpayable",
//           type: "function",
//         },
//         {
//           constant: true,
//           inputs: [],
//           name: "totalSupply",
//           outputs: [
//             {
//               name: "",
//               type: "uint256",
//             },
//           ],
//           payable: false,
//           stateMutability: "view",
//           type: "function",
//         },
//         {
//           constant: false,
//           inputs: [
//             {
//               name: "_from",
//               type: "address",
//             },
//             {
//               name: "_to",
//               type: "address",
//             },
//             {
//               name: "_value",
//               type: "uint256",
//             },
//           ],
//           name: "transferFrom",
//           outputs: [
//             {
//               name: "",
//               type: "bool",
//             },
//           ],
//           payable: false,
//           stateMutability: "nonpayable",
//           type: "function",
//         },
//         {
//           constant: true,
//           inputs: [],
//           name: "decimals",
//           outputs: [
//             {
//               name: "",
//               type: "uint8",
//             },
//           ],
//           payable: false,
//           stateMutability: "view",
//           type: "function",
//         },
//         {
//           constant: true,
//           inputs: [
//             {
//               name: "_owner",
//               type: "address",
//             },
//           ],
//           name: "balanceOf",
//           outputs: [
//             {
//               name: "balance",
//               type: "uint256",
//             },
//           ],
//           payable: false,
//           stateMutability: "view",
//           type: "function",
//         },
//         {
//           constant: true,
//           inputs: [],
//           name: "symbol",
//           outputs: [
//             {
//               name: "",
//               type: "string",
//             },
//           ],
//           payable: false,
//           stateMutability: "view",
//           type: "function",
//         },
//         {
//           constant: false,
//           inputs: [
//             {
//               name: "_to",
//               type: "address",
//             },
//             {
//               name: "_value",
//               type: "uint256",
//             },
//           ],
//           name: "transfer",
//           outputs: [
//             {
//               name: "",
//               type: "bool",
//             },
//           ],
//           payable: false,
//           stateMutability: "nonpayable",
//           type: "function",
//         },
//         {
//           constant: true,
//           inputs: [
//             {
//               name: "_owner",
//               type: "address",
//             },
//             {
//               name: "_spender",
//               type: "address",
//             },
//           ],
//           name: "allowance",
//           outputs: [
//             {
//               name: "",
//               type: "uint256",
//             },
//           ],
//           payable: false,
//           stateMutability: "view",
//           type: "function",
//         },
//         {
//           payable: true,
//           stateMutability: "payable",
//           type: "fallback",
//         },
//         {
//           anonymous: false,
//           inputs: [
//             {
//               indexed: true,
//               name: "owner",
//               type: "address",
//             },
//             {
//               indexed: true,
//               name: "spender",
//               type: "address",
//             },
//             {
//               indexed: false,
//               name: "value",
//               type: "uint256",
//             },
//           ],
//           name: "Approval",
//           type: "event",
//         },
//         {
//           anonymous: false,
//           inputs: [
//             {
//               indexed: true,
//               name: "from",
//               type: "address",
//             },
//             {
//               indexed: true,
//               name: "to",
//               type: "address",
//             },
//             {
//               indexed: false,
//               name: "value",
//               type: "uint256",
//             },
//           ],
//           name: "Transfer",
//           type: "event",
//         },
//       ];
//       const tokenContract = new ethers.Contract(
//         contractAddress,
//         tokenAbi,
//         provider,
//       );
//       console.log(tokenContract);
//       const nonce = await provider.getTransactionCount(
//         tokenContract.getAddress(),
//       );
//       // Prepare permit data
//       const domain = {
//         name: tokenName,
//         version: tokenVersion,
//         chainId: chainId,
//         verifyingContract: contractAddress,
//       };
//
//       const types = {
//         Permit: [
//           { name: "owner", type: "address" },
//           { name: "spender", type: "address" },
//           { name: "value", type: "uint256" },
//           { name: "nonce", type: "uint256" },
//           { name: "deadline", type: "uint256" },
//         ],
//       };
//       const values = {
//         owner: address,
//         spender: await contract?.getAddress(), // Replace with the spender's address
//         value: ethers.parseEther(value), // Amount to approve
//         nonce: nonce,
//         deadline: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
//       };
//
//       // Sign the permit
//       const signature = await signer.signTypedData(domain, types, values);
//
//       // Split the signature
//       sig = signature;
//     } catch (error) {
//       console.error(error);
//     }
//     console.log(sig);
//   }
// };
//
//
