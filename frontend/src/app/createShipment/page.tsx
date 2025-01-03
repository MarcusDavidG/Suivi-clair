"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from '@starknet-react/core';
import ConnectButton from '../components/lib/Connect';
import Header from "../components/internal/Header";

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

export default function CreateShipment() {
  const router = useRouter();
  const { address } = useAccount();
  const [formTouched, setFormTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !isFormValid) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Add your Starknet contract interaction here
      // Example:
      // await yourContract.create_shipment({
      //   product_name: formData.productName,
      //   description: formData.description,
      //   ...
      // });
      
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shipment');
    } finally {
      setIsLoading(false);
    }
  };

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