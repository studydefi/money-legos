/**
 * BlockIntel Gate — use sendWithGate(signer, tx) for Gate-protected transaction sends.
 * Replace signer.sendTransaction(tx) with:
 *   import { sendWithGate } from "./blockintel-gate";
 *   await sendWithGate(signer, tx);
 */
import { Gate } from "blockintel-gate-sdk";

const gate = new Gate({ apiKey: process.env.BLOCKINTEL_API_KEY });
const ctx = { requestId: "nexus_v1", reason: "opt-in" };

export async function sendWithGate(
  signer: { sendTransaction: (tx: unknown) => Promise<unknown> },
  tx: unknown
): Promise<unknown> {
  return gate.guard(ctx, async () => signer.sendTransaction(tx));
}
