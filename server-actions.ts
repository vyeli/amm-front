"use server";

import { ethers, Wallet } from "ethers";
import { signPermitSigature } from "ethers-js-permit";
//

//
// await targetContract.removeLiquidity( // contract call with permit
//   ...,
//   deadline,
//   false,
//   result.v,
//   result.r,
//   result.s
// )

const generatePermit = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Example permit data (you should customize this based on your needs)
      const domain = {
        name: "MyToken",
        version: "1",
        chainId: (await provider.getNetwork()).chainId,
        verifyingContract: "0x1234567890123456789012345678901234567890", // Replace with your contract address
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

      const value = {
        owner: address,
        spender: "0x0987654321098765432109876543210987654321", // Replace with the spender's address
        value: ethers.utils.parseEther("1.0"),
        nonce: 0, // You should get this from your contract
        deadline: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
      };

      const signature = await signer._signTypedData(domain, types, value);

      // Combine the permit data and signature
      const fullPermitData = JSON.stringify({
        domain,
        types,
        value,
        signature,
      });

      // Send the permit data to the server

      if (response.ok) {
        const result = await response.json();
        console.log("Server response:", result);
      } else {
        console.error("Server error:", await response.text());
      }
    } catch (error) {
      console.error("Failed to generate permit:", error);
    }
  } else {
    console.error("MetaMask is not installed");
  }
};

export async function swap(formData: FormData) {
  // const seed = formData.get("seed");
  // const originalToken = formData.get("originalToken");
  // const destinationToken = formData.get("destinationToken");
  //
  console.log(Object.fromEntries(formData.entries()));

  const wallet = Wallet.from;
  const nonce = await erc20Permit.nonces(wallet.address);
  const name = await erc20Permit.name();
  const permitConfig = {
    nonce,
    name,
    chainId: 1, // -> this should be 1 for ethereum.
    version: "1",
  };
  const deadline = 60 * 60 * 24;

  const result = await signPermitSigature(
    wallet,
    wallet.address,
    erc20Permit.address,
    targetContract,
    BigNumber.from("100"),
    deadline,
    permitConfig,
  );
}
