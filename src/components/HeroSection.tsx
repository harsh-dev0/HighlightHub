import React, { lazy, Suspense } from "react"
import Form from "./Form"
import ShimmerLoader from "./ShimmerLoader"

// const Form = lazy(() => {
//   return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
//     setTimeout(() => {
//       import("@/components/Form").then((mod) =>
//         resolve({ default: mod.default })
//       )
//     }, 2000)
//   })
// })

export default function HeroSection() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          SnapShorts
        </h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Turn YouTube videos into viral TikToks & Reels in seconds
        </p>

        <Suspense fallback={<ShimmerLoader />}>
          <Form />
        </Suspense>
      </div>
    </main>
  )
}
