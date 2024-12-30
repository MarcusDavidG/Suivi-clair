import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/shared/Navbar'
import { Footer } from './components/shared/Footer'
import { Suspense, lazy } from 'react'

// Import Home component directly since it's the main landing page
import { Home } from './pages/Home'

// Lazy load other pages
const CreateShipment = lazy(() => import('./pages/CreateShipment').then(module => ({ 
  default: module.default 
})))
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ 
  default: module.default 
})))
const TrackShipment = lazy(() => import('./pages/TrackShipment').then(module => ({ 
  default: module.default 
})))

// Loading component for page transitions
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateShipment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/track" element={<TrackShipment />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
