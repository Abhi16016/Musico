"use client"

import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import type { Track } from "../types/music"

interface PlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  isShuffle: boolean
  isLooping: boolean
  isLoading: boolean
  play: (track: Track) => Promise<void>
  pause: () => void
  next: () => void
  previous: () => void
  toggleShuffle: () => void
  toggleLoop: () => void
  setPlaylist: (tracks: Track[] | ((prev: Track[]) => Track[])) => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  getDuration: () => number
  getCurrentTime: () => number
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  const play = useCallback(async (track: Track) => {
    if (!audioRef.current) return

    try {
      setIsLoading(true)
      if (currentTrack?.id !== track.id) {
        setCurrentTrack(track)
        audioRef.current.src = track.audio
        await audioRef.current.load()
      }

      playPromiseRef.current = audioRef.current.play()
      await playPromiseRef.current
      setIsPlaying(true)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Play interrupted by pause, this is normal behavior')
      } else {
        console.error("Error playing audio:", error)
      }
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
      playPromiseRef.current = null
    }
  }, [currentTrack])

  const getNextTrackIndex = useCallback((currentIndex: number) => {
    if (isShuffle) {
      return Math.floor(Math.random() * playlist.length)
    }
    return (currentIndex + 1) % playlist.length
  }, [isShuffle, playlist.length])

  const next = useCallback(() => {
    if (playlist.length === 0 || !currentTrack) return
    if (isLooping) {
      play(currentTrack)
    } else {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
      const nextIndex = getNextTrackIndex(currentIndex)
      if (nextIndex !== currentIndex) {
        play(playlist[nextIndex])
      }
    }
  }, [playlist, currentTrack, getNextTrackIndex, play, isLooping])

  useEffect(() => {
    audioRef.current = new Audio()
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => {
        next()
      }
      audioRef.current.addEventListener('ended', handleEnded)
      return () => {
        audioRef.current?.removeEventListener('ended', handleEnded)
      }
    }
  }, [next])

  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
    playPromiseRef.current = null
  }, [])

  const getPreviousTrackIndex = useCallback((currentIndex: number) => {
    if (isShuffle) {
      return Math.floor(Math.random() * playlist.length)
    }
    return (currentIndex - 1 + playlist.length) % playlist.length
  }, [isShuffle, playlist.length])

  const previous = useCallback(() => {
    if (playlist.length === 0 || !currentTrack) return
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    const prevIndex = getPreviousTrackIndex(currentIndex)
    play(playlist[prevIndex])
  }, [playlist, currentTrack, getPreviousTrackIndex, play])

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev)
  }, [])

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev)
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [])

  const getDuration = useCallback(() => {
    return audioRef.current ? audioRef.current.duration : 0
  }, [])

  const getCurrentTime = useCallback(() => {
    return audioRef.current ? audioRef.current.currentTime : 0
  }, [])

  const contextValue = {
    currentTrack,
    isPlaying,
    isShuffle,
    isLooping,
    isLoading,
    play,
    pause,
    next,
    previous,
    toggleShuffle,
    toggleLoop,
    setPlaylist,
    seek,
    setVolume,
    getDuration,
    getCurrentTime,
  }

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}

