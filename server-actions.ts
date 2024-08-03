"use server";

import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import circuit from "./circuit/target/circuit.json";

interface GenerateProofInterface {
  nonce: number;
  amount1: number;
  amount2: number;
  token1: string;
  token2: string;
  sender: string;
}

export async function generateProof(payload: GenerateProofInterface) {
  try {
    const backend = new BarretenbergBackend(circuit);
    const noir = new Noir(circuit, backend);
    const input = {
      key: process.env.PRIVATE_SEED as string,
      nonce: payload.nonce,
      sender: payload.sender,
      amount1: payload.amount1,
      amount2: payload.amount2,
      token1: payload.token1,
      token2: payload.token2,
    };

    console.log(input);
    let proof = await noir.generateFinalProof(input);
    console.log(proof);
  } catch (error) {
    console.error(error);
  }
  return 5;
}
