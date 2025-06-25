import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Amenity } from '@/types/FilterTypes';
import { interestedPointsMap } from '@/utils/constants';

interface SearchStatusProps {
  loading: boolean;
  error: string | null;
  amenities: Amenity[];
  darkMode: boolean;
}

/**
 * SearchStatus Component
 *
 * This component displays the current status of a search for points of interest (amenities).
 * It handles and visually represents three states:
 *
 * 1. Loading State: Shows a spinner with a loading message while the search is in progress.
 * 2. Error State: Displays an error message if the search fails.
 * 3. Results State: If points of interest are found, shows a collapsible panel with a count and a preview list.
 *
 * Key Features:
 * - Uses framer-motion's AnimatePresence and motion components for smooth fade-in and fade-out animations on state changes.
 * - Implements an accessible Disclosure component from Headless UI to toggle the visibility of the list of found points.
 * - Adapts styles dynamically based on dark mode for better UX in different themes.
 * - Limits the preview list to the first 5 points and indicates if there are more.
 * - Displays icons and animations to enhance user feedback and interface clarity.
 */
const SearchStatus: React.FC<SearchStatusProps> = ({ loading, error, amenities, darkMode }) => (
    <AnimatePresence>
      {loading && (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`flex items-center space-x-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}
          >
            <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
              <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
              />
              <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
              />
            </svg>
            <span>A carregar pontos de interesse...</span>
          </motion.div>
      )}
      {error && (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${darkMode ? 'text-red-400' : 'text-red-600'}`}
          >
            ❌ {error}
          </motion.div>
      )}
      {amenities.length > 0 && (
          <Disclosure>
            {({ open }) => (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border p-4 rounded-lg 
              ${darkMode
                        ? 'bg-green-900 border-green-700 text-green-200'
                        : 'bg-green-50 border-green-200 text-green-700'}
            `}
                >
                  <Disclosure.Button className="flex justify-between w-full font-semibold">
              <span>
                ✅ {amenities.length} pontos encontrados
              </span>
                    <ChevronDownIcon
                        className={`h-5 w-5 transform ${open ? 'rotate-180' : ''} transition-transform`}
                    />
                  </Disclosure.Button>
                  <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={`mt-2 text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                      <ul className="list-disc pl-5">
                        {amenities.slice(0, 5).map((amenity) => (
                            <li key={amenity.id}>
                              {amenity.tags.name || 'Sem nome'} (
                              {Object.keys(interestedPointsMap).find(
                                  (key) =>
                                      interestedPointsMap[key] ===
                                      Object.entries(amenity.tags).find(([k, _]) =>
                                          ['amenity', 'shop', 'leisure', 'highway', 'railway', 'natural'].includes(k)
                                      )?.[1]
                              ) || 'Desconhecido'}
                              )
                            </li>
                        ))}
                        {amenities.length > 5 && (
                            <li className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              ...e mais {amenities.length - 5} pontos.
                            </li>
                        )}
                      </ul>
                    </Disclosure.Panel>
                  </Transition>
                </motion.div>
            )}
          </Disclosure>
      )}
    </AnimatePresence>
);

export default SearchStatus;
