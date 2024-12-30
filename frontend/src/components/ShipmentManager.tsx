import { useEffect, useState } from 'react'
import { useBlockRoute } from '../hooks/useBlockRoute'
import { ShipmentStatus } from '../config/contracts'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { BLOCKROUTE_ABI, BLOCKROUTE_ADDRESS } from '../config/contracts'

export function ShipmentManager({ shipmentId }: { shipmentId: bigint }) {
  const { address, useShipment } = useBlockRoute()
  const { data: shipment, isLoading: isLoadingShipment } = useShipment(shipmentId)
  const [newStatus, setNewStatus] = useState<ShipmentStatus>(ShipmentStatus.Created)

  // Prepare the contract write with arguments
  const { config } = usePrepareContractWrite({
    address: BLOCKROUTE_ADDRESS,
    abi: BLOCKROUTE_ABI,
    functionName: 'updateShipmentStatus',
    args: [shipmentId, newStatus, 'Status updated by user'],
  })

  const { 
    write: updateStatus,
    isLoading: isUpdating,
    isSuccess,
    error
  } = useContractWrite(config)

  useEffect(() => {
    if (shipment) {
      setNewStatus(shipment.status)
    }
  }, [shipment])

  const handleUpdateStatus = () => {
    if (!updateStatus) return
    updateStatus()
  }

  if (isLoadingShipment) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">Loading shipment...</p>
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">Shipment not found</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Shipment #{shipmentId.toString()}
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {ShipmentStatus[shipment.status]}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Product</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {shipment.productName}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {shipment.description}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
            Error: {error.message}
          </div>
        )}

        {isSuccess && (
          <div className="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded">
            Status updated successfully!
          </div>
        )}

        {address && (
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400">Update Status</span>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(Number(e.target.value) as ShipmentStatus)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {Object.entries(ShipmentStatus)
                  .filter(([key]) => !isNaN(Number(key)))
                  .map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
              </select>
            </label>

            <button
              onClick={handleUpdateStatus}
              disabled={isUpdating || !updateStatus}
              className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 
                       disabled:bg-gray-400 transition-colors"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
