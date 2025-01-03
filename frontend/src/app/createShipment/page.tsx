"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useContract } from '@starknet-react/core';
import { ByteArray } from 'starknet';
import {
  RpcClient,
  JsonRpcClient,
  RpcMutateParams,
  SubscriptionsClient,
  WsSubscriptionsClient,
  NodeEvent
} from "@calimero-is-near/calimero-p2p-sdk";
import ConnectButton from '../components/lib/Connect';
import Header from "../components/internal/Header";

// Contract configuration
const CONTRACT_ADDRESS = "0x042a429cf22dedf57d8caad50b1d2376e71dde2b1f78b570bc44a4e93d72bc04";
const CONTRACT_ABI = [
  {
    "name": "create_shipment",
    "type": "function",
    "inputs": [
      {
        "name": "product_name",
        "type": "felt"
      },
      {
        "name": "product_description",
        "type": "felt"
      },
      {
        "name": "location_origin",
        "type": "felt"
      },
      {
        "name": "location_destination",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "shipment_id",
        "type": "felt"
      }
    ],
    "stateMutability": "external"
  },
  {
    "name": "ShipmentCreated",
    "type": "event",
    "inputs": [
      {
        "name": "shipment_id",
        "type": "felt",
        "indexed": true
      },
      {
        "name": "product_name",
        "type": "felt",
        "indexed": false
      }
    ]
  }
];

// Initialize Calimero SDK clients
const rpcClient: RpcClient = new JsonRpcClient(
  process.env.NEXT_PUBLIC_RPC_BASE_URL!,
  process.env.NEXT_PUBLIC_RPC_PATH!
);

const wsClient: SubscriptionsClient = new WsSubscriptionsClient(
  process.env.NEXT_PUBLIC_RPC_BASE_URL!,
  "/ws"
);

// TypeScript interfaces
interface LocationInput {
  name: string;
  latitude: string;
  longitude: string;
}

interface FormData {
  productName: string;
  description: string;
  origin: LocationInput;
  destination: LocationInput;
  deliveredOn: string;
  arrivesOn: string;
  isTemperatureSensitive: boolean;
  isHumiditySensitive: boolean;
}

interface CreateShipmentArgs {
  product_name: string;
  product_description: string;
  location_origin: string;
  location_destination: string;
}

interface ShipmentResponse {
  id: string;
  product_name: string;
  product_description: string;
  location_origin: string;
  location_destination: string;
  status: string;
}

export default function CreateShipment() {
  const router = useRouter();
  const { address } = useAccount();
  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI
  });

  // State management
  const [formTouched, setFormTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    description: '',
    origin: {
      name: '',
      latitude: '',
      longitude: ''
    },
    destination: {
      name: '',
      latitude: '',
      longitude: ''
    },
    deliveredOn: '',
    arrivesOn: '',
    isTemperatureSensitive: false,
    isHumiditySensitive: false
  });

  // Form validation
  const isFormValid = Boolean(
    formData.productName &&
    formData.description &&
    formData.origin.name &&
    formData.origin.latitude &&
    formData.origin.longitude &&
    formData.destination.name &&
    formData.destination.latitude &&
    formData.destination.longitude &&
    formData.deliveredOn &&
    formData.arrivesOn
  );

  // WebSocket connection management
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        await wsClient.connect();
        wsClient.subscribe([process.env.NEXT_PUBLIC_CONTEXT_ID!]);
        wsClient.addCallback(handleWebSocketEvent);
        setWsConnected(true);
        console.log('WebSocket connected successfully');
      } catch (err) {
        console.error('WebSocket connection error:', err);
        setError('Failed to connect to tracking system');
      }
    };

    initializeWebSocket();

    return () => {
      if (wsConnected) {
        wsClient.removeCallback(handleWebSocketEvent);
        wsClient.disconnect();
      }
    };
  }, []);

  // WebSocket event handler
  const handleWebSocketEvent = (event: NodeEvent) => {
    console.log('Received WebSocket event:', event);
    
    if (event.type === 'ExecutionEvent') {
      switch (event.data.kind) {
        case 'ShipmentCreated':
          handleShipmentCreatedEvent(event.data);
          break;
        case 'Error':
          handleShipmentError(event.data);
          break;
      }
    }
  };

  const handleShipmentCreatedEvent = (data: any) => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const handleShipmentError = (data: any) => {
    setError(`Tracking system error: ${data.message || 'Unknown error'}`);
    setIsLoading(false);
  };

  // Form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as HTMLInputElement;
    
    if (!formTouched) {
      setFormTouched(true);
    }
    
    if (id.includes('.')) {
      const [parent, child] = id.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as LocationInput),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  // Calimero shipment creation
  const createCalimeroShipment = async (): Promise<ShipmentResponse> => {
    const originString = `${formData.origin.name}|${formData.origin.latitude}|${formData.origin.longitude}`;
    const destinationString = `${formData.destination.name}|${formData.destination.latitude}|${formData.destination.longitude}`;

    const params: RpcMutateParams<CreateShipmentArgs> = {
      applicationId: process.env.NEXT_PUBLIC_CONTEXT_ID!,
      method: "create_shipment",
      argsJson: {
        product_name: formData.productName,
        product_description: formData.description,
        location_origin: originString,
        location_destination: destinationString,
      }
    };

    try {
      const response = await rpcClient.mutate<CreateShipmentArgs, ShipmentResponse>(params);
      
      if (!response.output) {
        throw new Error('No response from tracking system');
      }
      
      return response.output;
    } catch (err) {
      console.error('Calimero create_shipment error:', err);
      throw new Error('Failed to create shipment in tracking system');
    }
  };

  // Starknet shipment creation
  const createStarknetShipment = async () => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    const productName = ByteArray.fromString(formData.productName);
    const description = ByteArray.fromString(formData.description);
    const originLocation = ByteArray.fromString(
      `${formData.origin.name}|${formData.origin.latitude}|${formData.origin.longitude}`
    );
    const destinationLocation = ByteArray.fromString(
      `${formData.destination.name}|${formData.destination.latitude}|${formData.destination.longitude}`
    );

    const createShipmentCall = contract.populateTransaction["create_shipment"]({
      product_name: productName,
      product_description: description,
      location_origin: originLocation,
      location_destination: destinationLocation
    });

    const transaction = await contract.execute(createShipmentCall);
    return transaction.wait();
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !isFormValid || !contract || !wsConnected) {
      setError('Please make sure all systems are connected and form is valid');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create shipment in Calimero first
      const calimeroShipment = await createCalimeroShipment();
      console.log('Calimero shipment created:', calimeroShipment);

      // Then create shipment in Starknet
      await createStarknetShipment();
      console.log('Starknet shipment created');

      // Success state will be handled by WebSocket callback
    } catch (err) {
      console.error('Error creating shipment:', err);
      setError(err instanceof Error ? err.message : 'Failed to create shipment');
      setIsLoading(false);
    }
  };

  // Render wallet connection UI if not connected
  if (!address) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-medium text-gray-100 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400 mb-6 text-sm font-light">
            Please connect your wallet to create a shipment
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh py-8 px-4">
         <Header />
      <div className="max-w-7xl py-36 mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 py-[10px] px-8 mt-8">
          <h1 className="font-medium text-gray-100 text-center text-xl pb-[5px]">
            Create a new Shipment
          </h1>

          {formTouched && isFormValid && error && (
            <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded border border-red-800">
              Error: {error}
            </div>
          )}

          {isSuccess && (
            <div className="mb-6 p-4 bg-green-900/50 text-green-200 rounded border border-green-800">
              Shipment created successfully! Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="productName" className="block font-medium text-gray-100 text-sm">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={formData.productName}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded border border-gray-800 
                         bg-gray-900/50 text-gray-100
                         focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-100">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded border border-gray-800 
                         bg-gray-900/50 text-gray-100
                         focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter description"
                rows={3}
                required
              />
            </div>

            {/* Origin Location */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-100 text-base">
                Origin Location
              </h3>
              <div>
                <label htmlFor="origin.name" className="block text-sm font-medium text-gray-100">
                  Location Name
                </label>
                <input
                  type="text"
                  id="origin.name"
                  value={formData.origin.name}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded border border-gray-800 
                           bg-gray-900/50 text-gray-100
                           focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter location name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="origin.latitude" className="block text-sm font-medium text-gray-100">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="origin.latitude"
                    value={formData.origin.latitude}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded border border-gray-800 
                             bg-gray-900/50 text-gray-100
                             focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="e.g. 40.7128"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="origin.longitude" className="block text-sm font-medium text-gray-100">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="origin.longitude"
                    value={formData.origin.longitude}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded border border-gray-800 
                             bg-gray-900/50 text-gray-100
                             focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="e.g. -74.0060"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Destination Location */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-100 text-base">
                Destination Location
              </h3>
              <div>
                <label htmlFor="destination.name" className="block text-sm font-medium text-gray-100">
                  Location Name
                </label>
                <input
                  type="text"
                  id="destination.name"
                  value={formData.destination.name}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded border border-gray-800 
                           bg-gray-900/50 text-gray-100
                           focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter location name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="destination.latitude" className="block text-sm font-medium text-gray-100">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="destination.latitude"
                    value={formData.destination.latitude}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded border border-gray-800 
                             bg-gray-900/50 text-gray-100
                             focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="e.g. 34.0522"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="destination.longitude" className="block text-sm font-medium text-gray-100">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="destination.longitude"
                    value={formData.destination.longitude}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded border border-gray-800 
                             bg-gray-900/50 text-gray-100
                             focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="e.g. -118.2437"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="deliveredOn" className="block text-sm font-medium text-gray-100">
                  Delivered On
                </label>
                <input
                  type="date"
                  id="deliveredOn"
                  value={formData.deliveredOn}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded border border-gray-800 
                           bg-gray-900/50 text-gray-100
                           focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="arrivesOn" className="block text-sm font-medium text-gray-100">
                  Arrives On
                </label>
                <input
                  type="date"
                  id="arrivesOn"
                  value={formData.arrivesOn}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded border border-gray-800 
                           bg-gray-900/50 text-gray-100
                           focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 py-[10px]">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isTemperatureSensitive"
                  checked={formData.isTemperatureSensitive}
                  onChange={handleChange}
                  className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-800 rounded"
                />
                <label htmlFor="isTemperatureSensitive" className="ml-2 block text-gray-100">
                  Temperature Sensitive
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isHumiditySensitive"
                  checked={formData.isHumiditySensitive}
                  onChange={handleChange}
                  className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-800 rounded"
                />
                <label htmlFor="isHumiditySensitive" className="ml-2 block text-gray-100">
                  Humidity Sensitive
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500/80 hover:bg-cyan-500 text-white p-3 rounded font-medium text-sm
                       transition-colors duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "Creating Shipment..." : "Create Shipment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}