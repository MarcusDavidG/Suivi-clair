import { useState } from 'react'
import { useAccount } from 'wagmi'
import { WalletButton } from '../../components/shared/ConnectWallet'
import { useNavigate } from 'react-router-dom'
import { useBlockRoute } from '../../hooks/useBlockRoute'

interface LocationInput {
  name: string
  latitude: string
  longitude: string
}

interface FormData {
  productName: string
  description: string
  origin: LocationInput
  destination: LocationInput
  deliveredOn: string
  arrivesOn: string
  isTemperatureSensitive: boolean
  isHumiditySensitive: boolean
}

export default function CreateShipment() {
  const navigate = useNavigate()
  const { address } = useAccount()
  const { useCreateShipment } = useBlockRoute()
  const [formTouched, setFormTouched] = useState(false)
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
  })

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
  )

  const getContractArgs = () => {
    if (!address || !isFormValid) return undefined

    const args = [
      formData.productName,
      formData.description,
      address,
      address,
      address,
      {
        latitude: formData.origin.latitude,
        longitude: formData.origin.longitude,
        name: formData.origin.name,
        timestamp: BigInt(new Date(formData.deliveredOn).getTime() / 1000),
        updatedBy: address
      },
      {
        latitude: formData.destination.latitude,
        longitude: formData.destination.longitude,
        name: formData.destination.name,
        timestamp: BigInt(new Date(formData.arrivesOn).getTime() / 1000),
        updatedBy: address
      },
      BigInt(new Date(formData.arrivesOn).getTime() / 1000),
      formData.isTemperatureSensitive,
      formData.isHumiditySensitive,
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ] as const

    return args
  }

  const { write, isLoading, isSuccess, error } = useCreateShipment(
    formTouched && isFormValid ? getContractArgs() : undefined
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as HTMLInputElement
    
    if (!formTouched) {
      setFormTouched(true)
    }
    
    if (id.includes('.')) {
      // Handle nested location objects
      const [parent, child] = id.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as LocationInput),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !write || !isFormValid) return

    try {
      await write()
    } catch (err) {
      console.error('Failed to create shipment:', err)
    }
  }

  // Redirect to dashboard after successful creation
  if (isSuccess) {
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Please connect your wallet to create a shipment
          </p>
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-300 dark:bg-gray-900 rounded-lg shadow-lg py-[10px] px-8 mt-8 text-xs">
          <h1 className="font-bold text-gray-900 dark:text-white text-center text-xl pb-[5px]">
            Create a new Shipment
          </h1>

          {formTouched && isFormValid && error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
              Error: {error.message}
            </div>
          )}

          {isSuccess && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded">
              Shipment created successfully! Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label
                htmlFor="productName"
                className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={formData.productName}
                onChange={handleChange}
                className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter description"
                rows={3}
                required
              />
            </div>

            {/* Origin Location */}
            <div className="space-y-1 pt-[15px]">
              <h3 className=" font-medium text-gray-900 dark:text-white text-base">
                Origin Location
              </h3>
              <div>
                <label
                  htmlFor="origin.name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Location Name
                </label>
                <input
                  type="text"
                  id="origin.name"
                  value={formData.origin.name}
                  onChange={handleChange}
                  className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter location name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="origin.latitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="origin.latitude"
                    value={formData.origin.latitude}
                    onChange={handleChange}
                    className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g.  40.7128"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="origin.longitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="origin.longitude"
                    value={formData.origin.longitude}
                    onChange={handleChange}
                    className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g.  -74.0060"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Destination Location */}
            <div className="space-y-1 pt-[15px]">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                Destination Location
              </h3>
              <div>
                <label
                  htmlFor="destination.name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Location Name
                </label>
                <input
                  type="text"
                  id="destination.name"
                  value={formData.destination.name}
                  onChange={handleChange}
                  className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter location name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="destination.latitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="destination.latitude"
                    value={formData.destination.latitude}
                    onChange={handleChange}
                    className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g.  34.0522"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="destination.longitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="destination.longitude"
                    value={formData.destination.longitude}
                    onChange={handleChange}
                    className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g.  -118.2437"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="deliveredOn"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Delivered On
                </label>
                <input
                  type="date"
                  id="deliveredOn"
                  value={formData.deliveredOn}
                  onChange={handleChange}
                  className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="arrivesOn"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Arrives On
                </label>
                <input
                  type="date"
                  id="arrivesOn"
                  value={formData.arrivesOn}
                  onChange={handleChange}
                  className="mt-1 p-[5px] block w-full rounded-md border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="h-4 p-[5px] w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isTemperatureSensitive"
                  className="ml-2 block text-gray-700 dark:text-gray-300"
                >
                  Temperature Sensitive
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isHumiditySensitive"
                  checked={formData.isHumiditySensitive}
                  onChange={handleChange}
                  className="h-4 w-4 p-[5px] text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isHumiditySensitive"
                  className="ml-2 block text-gray-700 dark:text-gray-300"
                >
                  Humidity Sensitive
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-400 text-white p-3 rounded font-bold text-sm
                       hover:bg-cyan-600 transition-colors disabled:bg-gray-500"
              disabled={isLoading || !write || !isFormValid}
            >
              {isLoading ? "Creating Shipment..." : "Create Shipment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
