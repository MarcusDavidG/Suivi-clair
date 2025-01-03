import { useContract } from "@starknet-react/core";
import { Contract, shortString } from "starknet";
import { 
  RpcClient, 
  JsonRpcClient, 
  SubscriptionsClient, 
  WsSubscriptionsClient,
  RpcMutateParams,
  NodeEvent 
} from "@calimero-is-near/calimero-p2p-sdk";

// Configuration constants based on your config.toml
const CONTRACT_ADDRESS = "0x05770edb03346b7d7d2db42c31b3046cb26dde222ee62f8152da75fb0b872473";
const CALIMERO_CONFIG = {
  wsEndpoint: "ws://127.0.0.1:2428/ws",
  rpcEndpoint: "http://127.0.0.1:2428/jsonrpc",
  contractId: "0x1b991ee006e2d1e372ab96d0a957401fa200358f317b681df2948f30e17c29c",
  network: "sepolia"
} as const;

interface ShipmentData {
  productName: string;
  productDescription: string;
  locationOrigin: string;
  locationDestination: string;
}

interface TrackedShipment extends ShipmentData {
  id: string;
}

export function useUnifiedShipping() {
  // Initialize StarkNet contract
  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: ABI
  });

  // Initialize Calimero clients with local endpoints from config
  const rpcClient: RpcClient = new JsonRpcClient(
    CALIMERO_CONFIG.rpcEndpoint,
    ""  // Empty path as it's included in the endpoint
  );
  
  const subscriptionsClient: SubscriptionsClient = new WsSubscriptionsClient(
    CALIMERO_CONFIG.wsEndpoint,
    ""  // Empty path as it's included in the endpoint
  );

  const initializeCalimero = async () => {
    try {
      // Connect to WebSocket
      await subscriptionsClient.connect();
      
      // Subscribe to contract events
      subscriptionsClient.subscribe([CALIMERO_CONFIG.contractId]);
      
      // Set up event listener for shipment updates
      subscriptionsClient.addCallback((event: NodeEvent) => {
        if (event.type === 'ExecutionEvent') {
          console.log('Shipment update received:', event.data);
          // You can add custom event handling here
        }
      });

      console.log('Calimero connection initialized successfully');
    } catch (error) {
      console.error("Error initializing Calimero connection:", error);
      throw error;
    }
  };

  const createShipment = async (shipmentData: ShipmentData) => {
    if (!contract) throw new Error("StarkNet contract not initialized");

    try {
      // Create shipment on StarkNet
      const starknetResponse = await contract.create_shipment(
        shortString.encodeShortString(shipmentData.productName),
        shortString.encodeShortString(shipmentData.productDescription),
        shortString.encodeShortString(shipmentData.locationOrigin),
        shortString.encodeShortString(shipmentData.locationDestination)
      );

      // Create corresponding shipment on Calimero
      const calimeroParams: RpcMutateParams<ShipmentData> = {
        applicationId: CALIMERO_CONFIG.contractId,
        method: "create_shipment",
        argsJson: shipmentData
      };

      const calimeroResponse = await rpcClient.mutate<ShipmentData, TrackedShipment>(
        calimeroParams
      );

      return {
        starknetTx: starknetResponse,
        calimeroShipment: calimeroResponse.output
      };
    } catch (error) {
      console.error("Error creating unified shipment:", error);
      throw error;
    }
  };

  const trackShipment = async (shipmentId: string) => {
    if (!contract) throw new Error("StarkNet contract not initialized");

    try {
      // Track on StarkNet
      const starknetResponse = await contract.track_shipment(shipmentId);
      const starknetShipment = {
        productName: shortString.decodeShortString(starknetResponse.product_name),
        productDescription: shortString.decodeShortString(starknetResponse.product_description),
        locationOrigin: shortString.decodeShortString(starknetResponse.location_origin),
        locationDestination: shortString.decodeShortString(starknetResponse.location_destination)
      };

      // Track on Calimero
      const calimeroParams: RpcMutateParams<{ shipmentId: string }> = {
        applicationId: CALIMERO_CONFIG.contractId,
        method: "track_shipment",
        argsJson: { shipmentId }
      };

      const calimeroResponse = await rpcClient.mutate<{ shipmentId: string }, TrackedShipment>(
        calimeroParams
      );

      return {
        starknet: starknetShipment,
        calimero: calimeroResponse.output
      };
    } catch (error) {
      console.error("Error tracking shipment:", error);
      throw error;
    }
  };

  return {
    initializeCalimero,
    createShipment,
    trackShipment,
    contract,
    rpcClient,
    subscriptionsClient
  };
}