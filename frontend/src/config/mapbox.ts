import mapboxgl from 'mapbox-gl'

export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWFyY3VzZGF2aWRnIiwiYSI6ImNscnlxZGVtZjBhbmQya3BnZGJxZGJwbGsifQ.Hs7jAZPHGBHG5K_Qw_qPrw'

export const defaultMapConfig = {
  style: 'mapbox://styles/mapbox/dark-v11',
  zoom: 12,
  attributionControl: false,
} as const

export function addRouteLayer(map: mapboxgl.Map, coordinates: [number, number][]) {
  // Add the route source
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates,
      },
    },
  })

  // Add the route line layer
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#f97316', // orange-500
      'line-width': 4,
      'line-opacity': 0.8,
    },
  })
}

export function createMarkerElement(type: 'start' | 'current' | 'end'): HTMLElement {
  const colors = {
    start: '#22c55e', // green-500
    current: '#f97316', // orange-500
    end: '#ef4444', // red-500
  }

  const el = document.createElement('div')
  el.className = 'marker'
  el.style.width = '24px'
  el.style.height = '24px'
  el.style.borderRadius = '50%'
  el.style.backgroundColor = colors[type]
  el.style.border = '3px solid white'
  el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
  el.style.cursor = 'pointer'

  return el
}
