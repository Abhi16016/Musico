"use client"

import { SearchBar } from "./search-bar"

export function Header({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-0 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mr-2">Musico</h1>
            <svg 
              className="w-6 h-6 sm:w-8 sm:h-8 text-white" 
              viewBox="0 0 48 48" 
              fill="currentColor"
            >
              <g>
                <g>
                  <path d="M14,46c-3.309,0-6-2.691-6-6s2.691-6,6-6h6v6C20,43.196,17.196,46,14,46z M14,36c-2.206,0-4,1.794-4,4s1.794,4,4,4 c2.289,0,4-2.112,4-4v-4H14z"/>
                  <path d="M34,40c-3.309,0-6-2.691-6-6s2.691-6,6-6h6v6C40,37.196,37.196,40,34,40z M34,30c-2.206,0-4,1.794-4,4s1.794,4,4,4 c2.289,0,4-2.112,4-4v-4H34z"/>
                  <polygon points="20,35 18,35 18,10.323 40,1.523 40,29 38,29 38,4.477 20,11.677"/>
                  <rect height="21.541" transform="matrix(0.3711 0.9286 -0.9286 0.3711 31.24 -18.1245)" width="2" x="28" y="3.23"/>
                </g>
              </g>
            </svg>
          </div>
          <div className="w-full sm:w-auto sm:max-w-xl">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
      </div>
    </header>
  )
}

