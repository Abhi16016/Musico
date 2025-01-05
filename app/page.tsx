"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { TrackCard } from "../components/track-card"
import { Player } from "../components/player"
import { Header } from "../components/header"
import { usePlayer } from "../context/player-context"
import type { Track } from "../types/music"
import { Skeleton } from "@/components/ui/skeleton"

const TRACKS_PER_PAGE = 30

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { setPlaylist } = usePlayer()

  const observer = useRef<IntersectionObserver>()
  const lastTrackElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, hasMore])

  const fetchTracks = useCallback(async (pageNumber: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=04b90385&limit=${TRACKS_PER_PAGE}&offset=${(pageNumber - 1) * TRACKS_PER_PAGE}&format=json&include=musicinfo`
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      const newTracks: Track[] = data.results.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist_name: track.artist_name,
        duration: track.duration,
        audio: track.audio,
        image: track.image || '/placeholder.svg?height=400&width=400',
        shareurl: track.shareurl,
      }))
      setTracks(prev => [...prev, ...newTracks])
      setFilteredTracks(prev => [...prev, ...newTracks])
      setPlaylist(prev => [...prev, ...newTracks])
      setHasMore(newTracks.length === TRACKS_PER_PAGE)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching tracks:", error)
      setHasMore(false)
      setIsLoading(false)
    }
  }, [setPlaylist])

  useEffect(() => {
    fetchTracks(page)
  }, [page, fetchTracks])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredTracks(tracks)
    } else {
      const filtered = tracks.filter(
        track => 
          track.name.toLowerCase().includes(query.toLowerCase()) ||
          track.artist_name.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredTracks(filtered)
    }
  }, [tracks])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onSearch={handleSearch} />
      <main className="container p-4 pb-24 md:pb-4">
        {isLoading && tracks.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {Array.from({ length: TRACKS_PER_PAGE }).map((_, index) => (
              <Skeleton key={index} className="h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] w-full bg-gray-800" />
            ))}
          </div>
        ) : filteredTracks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {filteredTracks.map((track, index) => (
              <div 
                key={track.id} 
                ref={!searchQuery && tracks.length === index + 1 ? lastTrackElementRef : null}
              >
                <TrackCard track={track} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            {searchQuery ? "No songs found matching your search." : "No songs available. Please check your internet connection and try again."}
          </div>
        )}
      </main>
      <Player />
    </div>
  )
}

