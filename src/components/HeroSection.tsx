import { Suspense } from "react"
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-800 px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-xl w-full text-center space-y-6 sm:space-y-8 backdrop-blur-sm bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/20 shadow-xl relative z-10">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Highlight<span className="text-purple-300">Hub</span>
          </h1>
          <p className="text-[15px] sm:text-xl text-purple-100 font-medium">
            Summarize YouTube videos and highlight key moments with AI.
          </p>
          <p className="text-xs sm:text-[16px] text-purple-200/80 px-2 sm:px-6">
            Get highlighted moments with timestamps that might help in
            editing for viral TikToks & Reels in seconds
          </p>
        </div>

        <div className="relative w-full">
          <Suspense fallback={<ShimmerLoader />}>
            <Form />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
