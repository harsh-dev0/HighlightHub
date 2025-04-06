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
    <div className="space-y-6 text-left animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
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

      {summary && (
        <div className="mt-6 p-4 border rounded-xl bg-white text-black shadow">
          <h3 className="text-lg font-semibold mb-2">
            Generated Short Script:
          </h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
}
