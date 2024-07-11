import React from 'react'
import documentsImg from './images/documents.svg'

export default function Documents() {
  return (
    <div>
      <div>
      <div className="sm:flex-auto">
        <h1 className="text-2xl font-bold leading-6 text-gray-900 tracking-tight">
          Documents
        </h1>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow mt-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <img
                src={documentsImg}
                alt="Documents"
                className="w-1/2 h-1/2 mx-auto"
              />
              <h3 className="text-lg font-bold text-zinc-800">
                All Your Documents in One Place
              </h3>
              <p className="text-sm font-normal text-gray-500 ml-2">
                Manage your contracts, insurance, and more.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  className="rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Add Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
