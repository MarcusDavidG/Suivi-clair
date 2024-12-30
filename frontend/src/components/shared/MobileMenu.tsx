import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'
import { ThemeToggle } from '../../providers/ThemeProvider'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 lg:hidden"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 -translate-x-full"
          enterTo="opacity-100 translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 -translate-x-full"
        >
          <Dialog.Panel className="fixed inset-y-0 left-0 w-full max-w-xs bg-gray-300 dark:bg-gray-900 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <Link
                    to="/"
                    className="text-xl font-bold text-cyan-500 dark:text-cyan-300"
                    onClick={onClose}
                  >
                    Suiviclair
                  </Link>
                  <ThemeToggle />
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <span className="sr-only">Close menu</span>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <Link
                  to="/"
                  onClick={onClose}
                  className={`block px-4 py-2 rounded-lg ${
                    isActive("/")
                      ? "bg-cyan-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/create"
                  onClick={onClose}
                  className={`block px-4 py-2 rounded-lg ${
                    isActive("/create")
                      ? "bg-cyan-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                  }`}
                >
                  Create Shipment
                </Link>
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className={`block px-4 py-2 rounded-lg ${
                    isActive("/dashboard")
                      ? "bg-cyan-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/track"
                  onClick={onClose}
                  className={`block px-4 py-2 rounded-lg ${
                    isActive("/track")
                      ? "bg-cyan-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                  }`}
                >
                  Track Shipment
                </Link>
              </nav>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
