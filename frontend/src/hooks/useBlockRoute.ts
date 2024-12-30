import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { 
  BLOCKROUTE_ADDRESS, 
  BLOCKROUTE_ABI,
  type Shipment,
  type Location
} from '../config/contracts'

type ReadonlyShipmentResponse = readonly [
  bigint,           // id
  string,          // productName
  string,          // description
  `0x${string}`,   // manufacturer
  `0x${string}`,   // supplier
  `0x${string}`,   // carrier
  `0x${string}`,   // receiver
  Location,        // origin
  Location,        // destination
  bigint,          // estimatedDeliveryDate
  number           // status
]

type ReadonlyLocation = {
  readonly latitude: string
  readonly longitude: string
  readonly name: string
  readonly timestamp: bigint
  readonly updatedBy: `0x${string}`
}

export function useBlockRoute() {
  const { address } = useAccount()

  // Read total shipments
  const { 
    data: totalShipments,
    isLoading: isLoadingTotal,
    error: totalError 
  } = useContractRead({
    address: BLOCKROUTE_ADDRESS,
    abi: BLOCKROUTE_ABI,
    functionName: 'getTotalShipments',
  })

  // Read shipment details
  const useShipment = (shipmentId: bigint) => {
    return useContractRead({
      address: BLOCKROUTE_ADDRESS,
      abi: BLOCKROUTE_ABI,
      functionName: 'getShipment',
      args: [shipmentId],
      enabled: Boolean(shipmentId && shipmentId > 0n),
      select: (data: ReadonlyShipmentResponse): Shipment => ({
        id: data[0],
        productName: data[1],
        description: data[2],
        manufacturer: data[3],
        supplier: data[4],
        carrier: data[5],
        receiver: data[6],
        origin: data[7],
        destination: data[8],
        estimatedDeliveryDate: data[9],
        status: data[10]
      })
    })
  }

  type CreateShipmentArgs = readonly [
    string,                  // productName
    string,                  // description
    `0x${string}`,          // supplier
    `0x${string}`,          // carrier
    `0x${string}`,          // receiver
    Location,               // origin
    Location,               // destination
    bigint,                 // estimatedDeliveryDate
    boolean,                // isTemperatureSensitive
    boolean,                // isHumiditySensitive
    `0x${string}`           // documentsHash
  ]

  // Create shipment
  const useCreateShipment = (args?: CreateShipmentArgs) => {
    const { config, error: prepareError } = usePrepareContractWrite({
      address: BLOCKROUTE_ADDRESS,
      abi: BLOCKROUTE_ABI,
      functionName: 'createShipment',
      enabled: Boolean(address && args),
      args: args // Remove the extra array wrapping
    })

    const { 
      write,
      data,
      isLoading,
      isSuccess,
      error: writeError
    } = useContractWrite(config)

    return {
      write,
      isLoading,
      isSuccess,
      error: writeError || prepareError,
      data
    }
  }

  // Update shipment status
  const useUpdateShipmentStatus = () => {
    const { config } = usePrepareContractWrite({
      address: BLOCKROUTE_ADDRESS,
      abi: BLOCKROUTE_ABI,
      functionName: 'updateShipmentStatus',
      enabled: Boolean(address)
    })

    return useContractWrite(config)
  }

  // Get transit history
  const useTransitHistory = (shipmentId: bigint) => {
    return useContractRead({
      address: BLOCKROUTE_ADDRESS,
      abi: BLOCKROUTE_ABI,
      functionName: 'getTransitHistory',
      args: [shipmentId],
      enabled: Boolean(shipmentId && shipmentId > 0n),
      select: (data: readonly ReadonlyLocation[]): Location[] => 
        data.map(loc => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
          name: loc.name,
          timestamp: loc.timestamp,
          updatedBy: loc.updatedBy
        }))
    })
  }

  // Update temperature and humidity
  const useUpdateEnvironmentalData = () => {
    const { config } = usePrepareContractWrite({
      address: BLOCKROUTE_ADDRESS,
      abi: BLOCKROUTE_ABI,
      functionName: 'updateTemperatureAndHumidity',
      enabled: Boolean(address)
    })

    return useContractWrite(config)
  }

  return {
    address,
    totalShipments,
    isLoadingTotal,
    totalError,
    useShipment,
    useCreateShipment,
    useUpdateShipmentStatus,
    useTransitHistory,
    useUpdateEnvironmentalData,
  }
}
