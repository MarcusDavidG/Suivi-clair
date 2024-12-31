import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";
import { Connector } from "wagmi";
import { SUIVICLAIR_ADDRESS, SUIVICLAIR_ABI } from "../../config/contracts";
import { ethers } from "ethers";

export function StarkNetConnectWallet() {
  const { address, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);
  const { connectors, connect } = useConnect();

  const handleConnect = (connector: Connector) => {
    connect({ connector });
    setShowModal(false);
  };

  const handleDisconnect = async () => {
    disconnect();
    localStorage.removeItem("wagmi.store");
    localStorage.removeItem("wagmi.wallet");
    localStorage.removeItem("wagmi.connected");
    window.location.reload();
  };

  const handleClick = () => {
    if (address) {
      handleDisconnect();
    } else {
      setShowModal(true);
    }
  };

  const interactWithContract = async (functionName: string, params: unknown[]) => {
    if (!address) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(SUIVICLAIR_ADDRESS, SUIVICLAIR_ABI, signer);

    try {
      let tx;
      if (functionName === "create_shipment") {
        tx = await contract.create_shipment(...params);
      } else if (functionName === "track_shipment") {
        tx = await contract.track_shipment(...params);
      }
      await tx.wait();
      alert("Transaction successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. See console for details.");
    }
  };

  const handleCreateShipment = () => {
    const params: [string, string, string, string] = [
      "Product Name", "Product Description", "Location Origin", "Location Destination"
    ];
    interactWithContract("create_shipment", params);
  };

  const handleTrackShipment = () => {
    const params: [number] = [
      1 // Example shipment ID
    ];
    interactWithContract("track_shipment", params);
  };

  const modal = showModal && !address && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Connect Wallet
        </h3>
        <div className="space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              className="w-full flex items-center justify-between p-3 rounded
                       bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                       dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {connector.name}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(false)}
          className="mt-4 w-full p-2 border border-gray-300 dark:border-gray-600 
                     rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 
                     dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const content = (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {address ? "Wallet Connected" : "Connect Your Wallet"}
      </h2>
      {address && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 font-mono">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </p>
      )}
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className={`bg-cyan-400 text-white px-6 py-3 rounded font-bold 
                   hover:bg-cyan-600 disabled:bg-gray-400 transition-colors`}
      >
        {isConnecting
          ? "Connecting..."
          : address
          ? "Disconnect"
          : "Connect Wallet"}
      </button>
      <button
        onClick={handleCreateShipment}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Create Shipment
      </button>
      <button
        onClick={handleTrackShipment}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Track Shipment
      </button>
      {modal}
    </div>
  );

  return content;
}
