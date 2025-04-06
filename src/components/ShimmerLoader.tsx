import React from "react"

export default function ShimmerLoader() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-xl" />
      <div className="h-24 bg-gray-200 rounded-xl" />
      <div className="h-12 bg-blue-300 rounded-xl" />
    </div>
  )
}
