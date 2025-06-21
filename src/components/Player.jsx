import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { PlayArrow, Pause, SkipPrevious, SkipNext, VolumeUp, VolumeOff, FavoriteBorder, Favorite, QueueMusic } from '@mui/icons-material';
import { Slider, IconButton, Tooltip } from '@mui/material';
import { togglePlayPause, prevSong, nextSong } from '../redux/features/playerSlice';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: linear-gradient(to right, #181818, #282828);
  border-top: 1px solid #404040;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
`;

const TrackInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 180px;
  max-width: 30%;
  gap: 12px;
`;

const AlbumArt = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const TrackMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const TrackTitle = styled.div`
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
`;

const ArtistName = styled.div`
  color: var(--text-secondary);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
`;

const Controls = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 722px;
  gap: 8px;
`;

const PlaybackControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledIconButton = styled(IconButton)`
  && {
    color: var(--text-secondary);
    transition: all 0.2s ease;
    
    &:hover {
      color: var(--text-primary);
      transform: scale(1.1);
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    &:disabled {
      color: #404040;
      opacity: 0.5;
    }
  }
`;

const PlayButton = styled(IconButton)`
  && {
    background-color: var(--text-primary);
    color: var(--bg-primary);
    width: 40px;
    height: 40px;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #f8f8f8;
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    &:disabled {
      background-color: #404040;
      color: #666;
      transform: none;
    }
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeDisplay = styled.div`
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
`;

const StyledProgressSlider = styled(Slider)`
  && {
    color: #1DB954;
    
    .MuiSlider-track {
      height: 4px;
      border-radius: 2px;
    }
    
    .MuiSlider-rail {
      height: 4px;
      background-color: #404040;
      border-radius: 2px;
    }
    
    .MuiSlider-thumb {
      width: 12px;
      height: 12px;
      background-color: #1DB954;
      border: 2px solid #fff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      display: none;
      transition: all 0.2s ease;
      
      &:hover, &.Mui-focusVisible {
        box-shadow: 0 0 0 8px rgba(29, 185, 84, 0.2);
        transform: scale(1.2);
      }
    }
    
    &:hover .MuiSlider-thumb {
      display: block;
    }
    
    .MuiSlider-valueLabel {
      background-color: #1DB954;
      color: white;
      font-size: 12px;
      font-weight: 600;
    }
  }
`;

const VolumeControls = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  min-width: 180px;
  max-width: 30%;
`;

const VolumeIcon = styled.div`
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const StyledVolumeSlider = styled(Slider)`
  && {
    color: var(--text-secondary);
    
    .MuiSlider-track {
      height: 4px;
      border-radius: 2px;
    }
    
    .MuiSlider-rail {
      height: 4px;
      background-color: #404040;
      border-radius: 2px;
    }
    
    .MuiSlider-thumb {
      width: 12px;
      height: 12px;
      background-color: var(--text-secondary);
      border: 2px solid #fff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      display: none;
      transition: all 0.2s ease;
      
      &:hover, &.Mui-focusVisible {
        box-shadow: 0 0 0 8px rgba(179, 179, 179, 0.2);
        transform: scale(1.2);
      }
    }
    
    &:hover .MuiSlider-thumb {
      display: block;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 14px;
  font-style: italic;
  height: 56px;
`;

function Player() {
  const [volume, setVolume] = useState(70);
  const [seekValue, setSeekValue] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());
  
  const { activeSong, currentSongs, currentIndex, isActive, isPlaying } = useSelector((state) => state.player);
  const dispatch = useDispatch();

  // Load new track when activeSong changes
  useEffect(() => {
    if (activeSong?.audio) {
      audioRef.current.pause();
      audioRef.current = new Audio(activeSong.audio);
      audioRef.current.volume = volume / 100;

      // auto play if state says playing
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);
        setSeekValue((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        handleNextSong();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSong]);

  // Play / Pause based on global state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (!isActive) return;
    dispatch(togglePlayPause());
  };

  const handlePrevSong = () => {
    if (!isActive) return;
    
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  };

  const handleNextSong = () => {
    if (!isActive) return;
    
    if (currentIndex === currentSongs.length - 1) {
      dispatch(nextSong(0));
    } else {
      dispatch(nextSong(currentIndex + 1));
    }
  };

  const handleVolumeToggle = () => {
    setVolume(volume > 0 ? 0 : 70);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PlayerContainer>
      <TrackInfo>
        {activeSong?.images?.coverart ? (
          <>
            <AlbumArt src={activeSong?.images?.coverart} alt="album art" />
            <TrackMeta>
              <TrackTitle>{activeSong?.title}</TrackTitle>
              <ArtistName>{activeSong?.subtitle}</ArtistName>
            </TrackMeta>
            <ActionButtons>
              <Tooltip title={isLiked ? "Remove from Liked Songs" : "Add to Liked Songs"}>
                <StyledIconButton onClick={() => setIsLiked(!isLiked)}>
                  {isLiked ? <Favorite sx={{ color: '#1DB954' }} /> : <FavoriteBorder />}
                </StyledIconButton>
              </Tooltip>
              <Tooltip title="Queue">
                <StyledIconButton>
                  <QueueMusic />
                </StyledIconButton>
              </Tooltip>
            </ActionButtons>
          </>
        ) : (
          <EmptyState>No track selected</EmptyState>
        )}
      </TrackInfo>

      <Controls>
        <PlaybackControls>
          <Tooltip title="Previous">
            <StyledIconButton onClick={handlePrevSong} disabled={!isActive}>
              <SkipPrevious />
            </StyledIconButton>
          </Tooltip>
          
          <Tooltip title={isPlaying ? "Pause" : "Play"}>
            <PlayButton onClick={handlePlayPause} disabled={!isActive}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </PlayButton>
          </Tooltip>
          
          <Tooltip title="Next">
            <StyledIconButton onClick={handleNextSong} disabled={!isActive}>
              <SkipNext />
            </StyledIconButton>
          </Tooltip>
        </PlaybackControls>
        
        <ProgressContainer>
          <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
          <StyledProgressSlider
            size="small"
            value={seekValue}
            onChange={(e, v) => {
              if (!audioRef.current.duration) return;
              const newTime = (v / 100) * audioRef.current.duration;
              audioRef.current.currentTime = newTime;
              setSeekValue(v);
            }}
          />
          <TimeDisplay>{formatTime(duration)}</TimeDisplay>
        </ProgressContainer>
      </Controls>

      <VolumeControls>
        <Tooltip title={volume === 0 ? "Unmute" : "Mute"}>
          <VolumeIcon onClick={handleVolumeToggle}>
            {volume === 0 ? <VolumeOff /> : <VolumeUp />}
          </VolumeIcon>
        </Tooltip>
        <StyledVolumeSlider
          size="small"
          value={volume}
          onChange={(e, v) => setVolume(v)}
          sx={{ width: 100 }}
        />
      </VolumeControls>
    </PlayerContainer>
  );
}

export default Player;
