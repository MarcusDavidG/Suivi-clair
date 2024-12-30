interface MapErrorProps {
  message: string
}

export function MapLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-white font-medium">Loading map data...</p>
      </div>
    </div>
  )
}

export function MapError({ message }: MapErrorProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg p-4">
          <p className="font-medium">Error loading map</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
    </div>
  )
}

export function MapNoData() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-gray-900 dark:text-white font-medium">No shipment data found</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Please check the shipment ID and try again
          </p>
        </div>
      </div>
    </div>
  )
}
