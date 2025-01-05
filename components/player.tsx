"use client"

import React, { useState, useEffect, useCallback } from "react"
import { usePlayer } from "../context/player-context"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Shuffle, Share2, Repeat, Repeat1, Volume2, VolumeX } from 'lucide-react'
import { formatTime } from "../utils/format-time"
import { toast } from "sonner"

export function Player() {
  const { 
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
    seek,
    setVolume,
    getDuration,
    getCurrentTime
  } = usePlayer()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isChangingTrack, setIsChangingTrack] = useState(false)

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause()
    } else if (currentTrack) {
      play(currentTrack)
    }
  }, [isPlaying, pause, play, currentTrack])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime())
      setDuration(getDuration())
    }, 1000)
    return () => clearInterval(interval)
  }, [getCurrentTime, getDuration])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault();
        handlePlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePlayPause]);

  const handleSeek = useCallback((newTime: number[]) => {
    seek(newTime[0])
    setCurrentTime(newTime[0])
  }, [seek])

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const volumeValue = newVolume[0] / 100
    setVolumeState(volumeValue)
    setVolume(volumeValue)
    setIsMuted(volumeValue === 0)
  }, [setVolume])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev
      setVolume(newMuted ? 0 : volume)
      return newMuted
    })
  }, [setVolume, volume])

  const handleShare = useCallback(() => {
    if (!currentTrack) return
    
    navigator.clipboard.writeText(currentTrack.shareurl)
      .then(() => toast.success("Share link copied to clipboard!"))
      .catch(() => toast.error("Couldn't copy share link. Please try again."))
  }, [currentTrack])

  const handleNext = useCallback(() => {
    setIsChangingTrack(true)
    next()
    setTimeout(() => setIsChangingTrack(false), 500)
  }, [next])

  const handlePrevious = useCallback(() => {
    setIsChangingTrack(true)
    previous()
    setTimeout(() => setIsChangingTrack(false), 500)
  }, [previous])

  const handleToggleShuffle = useCallback(() => {
    toggleShuffle()
    toast(isShuffle ? "Shuffle mode off" : "Shuffle mode on")
  }, [toggleShuffle, isShuffle])

  const handleToggleLoop = useCallback(() => {
    toggleLoop()
    toast(isLooping ? "Repeat mode off" : "Repeat mode on")
  }, [toggleLoop, isLooping])

  if (!currentTrack) return null

  return (
    <Card className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="px-2 pt-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full [&>.relative>.absolute]:bg-[#fefae0] [&_[role=slider]]:bg-[#fefae0]"
            />
          </div>
          
          <div className="px-4 py-2 flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={currentTrack.image} 
                    alt={currentTrack.name} 
                    className="w-12 h-12 rounded-md"
                  />
                  <div className="min-w-0">
                    <h4 className="font-medium text-white text-base truncate">{currentTrack.name}</h4>
                    <p className="text-sm text-gray-400 truncate">{currentTrack.artist_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
                  <span className="text-xs text-gray-400">/</span>
                  <span className="text-xs text-gray-400">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex-1" />
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleToggleLoop} 
                    aria-label={isLooping ? "Disable repeat" : "Enable repeat"}
                    className={`text-white hover:bg-transparent hover:text-[#fefae0] ${isLooping ? "text-blue-500" : ""}`}
                  >
                    {isLooping ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handlePrevious} aria-label="Previous track" className="text-white hover:bg-transparent hover:text-[#fefae0]">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={handlePlayPause}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    disabled={isLoading || isChangingTrack}
                    className="hover:bg-[#fefae0] hover:text-gray-900"
                  >
                    {isLoading || isChangingTrack ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                    ) : isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleNext} aria-label="Next track" className="text-white hover:bg-transparent hover:text-[#fefae0]">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleToggleShuffle} 
                    aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
                    className={`text-white hover:bg-transparent hover:text-[#fefae0] ${isShuffle ? "text-blue-500" : ""}`}
                  >
                    <Shuffle className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 flex items-center justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="text-white hover:bg-transparent hover:text-[#fefae0]"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-24 [&_[role=slider]]:bg-[#fefae0] [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-none [&>.relative>.absolute]:bg-[#fefae0]"
                  />
                  <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share track" className="text-white hover:bg-transparent hover:text-[#fefae0]">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div aria-live="polite" className="sr-only">
                Now playing: {currentTrack.name} by {currentTrack.artist_name}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Player;

