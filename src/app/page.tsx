"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ConnectBitcoin, useZetaChainClient, useEthersSigner } from "@/index";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useBitcoinWallet } from "@/providers/BitcoinWalletProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Balances } from "@/index";

const Page = () => {
  const account = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({ chainId });
  const signer = useEthersSigner({ walletClient });
  const client = useZetaChainClient({ network: "testnet", signer });
  const { address: bitcoinAddress, sendTransaction } = useBitcoinWallet();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const handleSendTransaction = async () => {
    try {
      const value = parseFloat(amount);
      if (isNaN(value) || value <= 0) {
        console.error("Invalid amount");
        return;
      }

      const txHash = await sendTransaction({ to, value, memo });

      console.log("Transaction Hash:", txHash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="m-4">
      <div className="flex justify-end gap-2 mb-10">
        <ThemeToggle />
        <ConnectBitcoin />
        <ConnectButton label="Connect EVM" showBalance={false} />
      </div>
      <div className="flex justify-center">
        <div className="w-[400px]">
          {client && (
            <div className="flex flex-col gap-3">
              <Input
                placeholder="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Input
                placeholder="Message"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
              <Button onClick={handleSendTransaction}>Send Transaction</Button>
              <Balances
                account={account}
                client={client}
                bitcoin={bitcoinAddress}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
