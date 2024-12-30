import { useBlockRoute } from '../../hooks/useBlockRoute'
import { WalletButton } from '../../components/shared/ConnectWallet'
import { ShipmentStatus, type Shipment } from '../../config/contracts'

function getStatusColor(status: ShipmentStatus): string {
  switch (status) {
    case ShipmentStatus.Created:
      return 'bg-blue-300 text-blue-950 dark:bg-blue-900 dark:text-blue-200'
    case ShipmentStatus.QualityChecked:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case ShipmentStatus.InTransit:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case ShipmentStatus.Delayed:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case ShipmentStatus.Disputed:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case ShipmentStatus.ResolvingDispute:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case ShipmentStatus.Delivered:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case ShipmentStatus.Rejected:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case ShipmentStatus.Cancelled:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function Dashboard() {
  const { address, totalShipments, useShipment } = useBlockRoute()

  // Get the last 5 shipments if total shipments is available
  const total = totalShipments ? Number(totalShipments) : 0
  const shipment1 = useShipment(BigInt(total))
  const shipment2 = useShipment(BigInt(Math.max(total - 1, 0)))
  const shipment3 = useShipment(BigInt(Math.max(total - 2, 0)))
  const shipment4 = useShipment(BigInt(Math.max(total - 3, 0)))
  const shipment5 = useShipment(BigInt(Math.max(total - 4, 0)))

  const isLoading = [shipment1, shipment2, shipment3, shipment4, shipment5]
    .some(s => s.isLoading)

  const shipments = [
    shipment1.data,
    shipment2.data,
    shipment3.data,
    shipment4.data,
    shipment5.data
  ].filter((s): s is Shipment => Boolean(s))

  if (!address) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to view the dashboard
          </p>
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white mt-8">
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 ">
          <div className="p-6 rounded-lg bg-gray-300 dark:bg-gray-900">
            <h3 className="text-lg font-semibold mb-2">Total Shipments</h3>
            <p className="text-3xl font-bold text-cyan-500">
              {totalShipments?.toString() || "0"}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-300 dark:bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Recent Shipments</h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading shipments...
                </p>
              </div>
            ) : shipments.length > 0 ? (
              shipments.map((shipment) => (
                <div
                  key={shipment.id.toString()}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{shipment.productName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      From: {truncateAddress(shipment.supplier)} To:{" "}
                      {truncateAddress(shipment.receiver)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {ShipmentStatus[shipment.status]}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No recent shipments
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
