"use client"

import React, { useState, useTransition } from "react"

export default function Form() {
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const url = formData.get("url") as string
    const transcript = formData.get("transcript") as string

    startTransition(async () => {
      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoId: url,
            transcript: transcript || null,
          }),
        })

        const data = await res.json()

        if (res.ok) {
          setSummary(data.summary)
        } else {
          setSummary("Error: " + data.error)
        }
      } catch (err) {
        setSummary("Something went wrong.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    })
  }

  return (
    <div className="space-y-6 text-left animate-fade-in w-full px-2 sm:px-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-purple-100 mb-2"
          >
            YouTube Video URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            required
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-1 block w-full rounded-xl border text-purple-950 border-purple-300/30 bg-white/10 backdrop-blur-sm shadow-lg shadow-purple-900/20 p-3 sm:p-4 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder:text-purple-300/50"
          />
        </div>

        {/* <div>
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
        </div> */}

        <button
          type="submit"
          disabled={loading || isPending}
          className="w-full bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold py-3 sm:py-4 rounded-xl hover:from-purple-700 hover:to-violet-600 transition disabled:opacity-70 shadow-lg shadow-purple-900/30 mt-4"
        >
          {loading || isPending ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Highlights...
            </span>
          ) : (
            "Create Viral Highlights"
          )}
        </button>
      </form>

      {summary && (
        <div className="mt-8 p-5 sm:p-6 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-purple-50 shadow-lg shadow-purple-900/20 mx-auto w-full">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-purple-100">
            Your Video Highlights:
          </h3>
          <p className="text-sm sm:text-base leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  )
}
