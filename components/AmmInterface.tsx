'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}



export default function AmmInterface(){
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        // Initialize contract
        const contractAddress = 'YOUR_CONTRACT_ADDRESS';
        const contractABI = [
            // Your contract ABI here
            // For example:
            // {
            //   "inputs": [],
            //   "name": "swap",
            //   "outputs": [],
            //   "stateMutability": "nonpayable",
            //   "type": "function"
            // }
          ] as const;
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.log('Please install MetaMask');
    }
  };

  const swap = async (amount: string, fromToken: string, toToken: string) => {
    if (contract) {
      try {
        const tx = await contract.swap(amount, fromToken, toToken);
        await tx.wait();
        console.log('Swap successful');
      } catch (error) {
        console.error('Swap failed:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AMM Interface</h1>
      {account ? (
        <div>
          <p className="mb-4">Connected: {account}</p>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amount" type="text" placeholder="Amount" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fromToken">
                From Token
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="fromToken" type="text" placeholder="From Token" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="toToken">
                To Token
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="toToken" type="text" placeholder="To Token" />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => swap('1', 'TokenA', 'TokenB')}>
                Swap
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};
