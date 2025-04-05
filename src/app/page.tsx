"use client"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    console.log("WE ARE SO BACK")
  }, [])
  return <div className="text-2xl p-10">Script2Shorts: Coming Soon</div>
}
