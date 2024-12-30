import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useBlockRoute } from '../../hooks/useBlockRoute'
import { WalletButton } from '../../components/shared/ConnectWallet'
import { ShipmentStatus } from '../../config/contracts'
import { MapLoading, MapError, MapNoData } from '../../components/shared/MapLoading'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom marker icons
const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Map bounds adjuster component
function MapBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates.map(coord => L.latLng(coord[0], coord[1])))
      map.fitBounds(bounds, { padding: [50, 50] })

      // Draw the route line
      const routeLine = L.polyline(coordinates, {
        color: '#f97316', // orange-500
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10' // Creates a dashed line
      }).addTo(map)

      return () => {
        map.removeLayer(routeLine)
      }
    }
  }, [coordinates, map])

  return null
}

export default function TrackShipment() {
  const [shipmentId, setShipmentId] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const { address, useShipment, useTransitHistory } = useBlockRoute()

  // Get shipment data
  const { 
    data: shipment,
    isLoading: isLoadingShipment,
    error: shipmentError 
  } = useShipment(isTracking ? BigInt(shipmentId) : 0n)

  // Get transit history
  const {
    isLoading: isLoadingHistory,
    error: historyError
  } = useTransitHistory(isTracking ? BigInt(shipmentId) : 0n)

  const handleTrackShipment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsTracking(true)
  }

  const handleReset = () => {
    setIsTracking(false)
  }

  if (!address) {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to track shipments
          </p>
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-10 min-h-screen text-gray-900 bg-white dark:bg-gray-950 dark:text-white">
      {!isTracking ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-300 dark:bg-gray-900 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-cyan-500 dark:text-cyan-300 mb-6 text-center">
                Track Your Shipment
              </h1>

              {(shipmentError || historyError) && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
                  Error: {shipmentError?.message || historyError?.message}
                </div>
              )}

              <form onSubmit={handleTrackShipment} className="space-y-6">
                <div>
                  <label
                    htmlFor="shipmentId"
                    className="block text-sm font-medium mb-2"
                  >
                    Shipment ID
                  </label>
                  <input
                    type="text"
                    id="shipmentId"
                    value={shipmentId}
                    onChange={(e) => setShipmentId(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 
                             text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your shipment ID"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-500 text-gray-100 p-3 rounded font-bold 
                           hover:bg-cyan-600 transition-colors disabled:bg-gray-400"
                >
                  Track Shipment
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col">
          {/* Shipment Info Bar */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Shipment #{shipmentId}</h2>
                {shipment && (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ">
                      Status: {ShipmentStatus[shipment.status]}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Product: {shipment.productName}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={handleReset}
                className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600 font-bold text-gray-100"
              >
                Track Another
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-grow relative">
            <div className="absolute inset-0">
              {shipment && (
                <MapContainer
                  key={`map-${shipmentId}`}
                  className="h-full w-full"
                  center={[0, 0]}
                  zoom={2}
                  scrollWheelZoom={true}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* Origin Marker */}
                  <Marker
                    position={[
                      parseFloat(shipment.origin.latitude),
                      parseFloat(shipment.origin.longitude),
                    ]}
                    icon={originIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold">Origin</h3>
                        <p>{shipment.origin.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            Number(shipment.origin.timestamp)
                          ).toLocaleString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Destination Marker */}
                  <Marker
                    position={[
                      parseFloat(shipment.destination.latitude),
                      parseFloat(shipment.destination.longitude),
                    ]}
                    icon={destinationIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold">Destination</h3>
                        <p>{shipment.destination.name}</p>
                        <p className="text-sm text-gray-500">
                          ETA:{" "}
                          {new Date(
                            Number(shipment.estimatedDeliveryDate)
                          ).toLocaleString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Map bounds adjuster and route line */}
                  <MapBounds
                    coordinates={[
                      [
                        parseFloat(shipment.origin.latitude),
                        parseFloat(shipment.origin.longitude),
                      ],
                      [
                        parseFloat(shipment.destination.latitude),
                        parseFloat(shipment.destination.longitude),
                      ],
                    ]}
                  />
                </MapContainer>
              )}
            </div>
            {(isLoadingShipment || isLoadingHistory) && <MapLoading />}
            {shipmentError && <MapError message={shipmentError.message} />}
            {historyError && <MapError message={historyError.message} />}
            {!isLoadingShipment && !shipment && <MapNoData />}
          </div>
        </div>
      )}
    </div>
  );
}
