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

export async function swap(sig: JSON) {
  // const seed = formData.get("seed");
  // const originalToken = formData.get("originalToken");
  // const destinationToken = formData.get("destinationToken");
  //
  console.log(sig);
  return 5;
}
