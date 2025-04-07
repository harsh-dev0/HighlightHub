export default function ShimmerLoader() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-purple-300/30 rounded-xl backdrop-blur-sm border border-white/10" />
      <div className="h-12 bg-purple-400/30 rounded-xl backdrop-blur-sm border border-white/10" />
    </div>
  )
}
