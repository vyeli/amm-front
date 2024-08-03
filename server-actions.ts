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

export async function swap(formData: FormData) {
  // const seed = formData.get("seed");
  // const originalToken = formData.get("originalToken");
  // const destinationToken = formData.get("destinationToken");
  //
  console.log(Object.fromEntries(formData.entries()));
  return 5;
}
