"use client"

import React, { useState, useTransition } from "react"

export default function Form() {
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    startTransition(() => {
      setTimeout(() => {
        setLoading(false)
        alert("Short generated!")
      }, 2000)
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-left animate-fade-in"
    >
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          YouTube Video URL
        </label>
        <input
          type="url"
          id="url"
          name="url"
          required
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-1 block w-full rounded-xl border text-black border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="transcript"
          className="block text-sm font-medium text-gray-700"
        >
          Optional Transcript
        </label>
        <textarea
          id="transcript"
          name="transcript"
          rows={4}
          placeholder="Paste the video transcript here (optional)"
          className="mt-1 block w-full text-black rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading || isPending}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading || isPending ? "Generating..." : "Generate Short"}
      </button>
    </form>
  )
}
