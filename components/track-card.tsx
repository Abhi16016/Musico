import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause } from 'lucide-react'
import { usePlayer } from "../context/player-context"
import type { Track } from "../types/music"
import Image from "next/image"
import { formatTime } from "../utils/format-time"

interface TrackCardProps {
  track: Track
}

export function TrackCard({ track }: TrackCardProps) {
  const { currentTrack, isPlaying, play, pause } = usePlayer()
  const isCurrentTrack = currentTrack?.id === track.id

  const handlePlayClick = () => {
    isCurrentTrack && isPlaying ? pause() : play(track)
  }

  return (
    <Card className="group relative overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={track.image}
            alt={track.name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700 hover:text-white"
              onClick={handlePlayClick}
            >
              {isCurrentTrack && isPlaying ? (
                <Pause className="h-6 w-6 sm:h-8 sm:w-8" />
              ) : (
                <Play className="h-6 w-6 sm:h-8 sm:w-8" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-2 sm:p-3 md:p-4">
          <h3 className="font-medium text-sm sm:text-base md:text-lg text-white truncate">{track.name}</h3>
          <p className="text-xs sm:text-sm text-gray-400 truncate">{track.artist_name}</p>
          <p className="text-xs text-gray-500 mt-1">{formatTime(track.duration)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

