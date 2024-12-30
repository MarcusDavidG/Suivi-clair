import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";
import { Connector } from "wagmi";

interface ConnectWalletProps {
  className?: string;
  fullScreen?: boolean;
}

export function ConnectWallet({
  className = "",
  fullScreen = false,
}: ConnectWalletProps) {
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
    // Clear any stored connection data
    localStorage.removeItem("wagmi.store");
    localStorage.removeItem("wagmi.wallet");
    localStorage.removeItem("wagmi.connected");
    // Force page reload to clear any cached wallet state
    window.location.reload();
  };

  const handleClick = () => {
    if (address) {
      handleDisconnect();
    } else {
      setShowModal(true);
    }
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
              <span className="text-2xl">
                {connector.name === "MetaMask"}
                {connector.name === "Coinbase Wallet"}
                {connector.name === "WalletConnect"}
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
                   hover:bg-cyan-600 disabled:bg-gray-400 transition-colors ${className} `}
      >
        {isConnecting
          ? "Connecting..."
          : address
          ? "Disconnect"
          : "Connect Wallet"}
      </button>
      {modal}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

export function WalletButton() {
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
    // Clear any stored connection data
    localStorage.removeItem("wagmi.store");
    localStorage.removeItem("wagmi.wallet");
    localStorage.removeItem("wagmi.connected");
    // Force page reload to clear any cached wallet state
    window.location.reload();
  };

  const handleClick = () => {
    if (address) {
      handleDisconnect();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className="bg-cyan-400 text-gray-900 px-4 py-2 rounded font-bold 
                   hover:bg-cyan-600 disabled:bg-gray-400 transition-colors md:w-auto min-w-[120px]"
      >
        {isConnecting
          ? "Connecting..."
          : address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : "Connect Wallet"}
      </button>

      {showModal && !address && (
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
                  <span className="text-2xl">
                    {connector.name === "MetaMask"}
                    {connector.name === "Coinbase Wallet"}
                    {connector.name === "WalletConnect"}
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
      )}
    </>
  );
}
