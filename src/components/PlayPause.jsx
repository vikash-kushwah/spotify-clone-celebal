import React from 'react';
import { PlayArrow, Pause } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import styled from 'styled-components';

const StyledIconButton = styled(IconButton)`
  && {
    color: #1DB954;
    background-color: white;
    width: 48px;
    height: 48px;
    
    &:hover {
      background-color: white;
      transform: scale(1.1);
    }
  }
`;

const PlayPause = ({ isPlaying, activeSong, song, handlePause, handlePlay }) => (
  isPlaying && activeSong?.title === song.title ? (
    <StyledIconButton onClick={handlePause}>
      <Pause />
    </StyledIconButton>
  ) : (
    <StyledIconButton onClick={handlePlay}>
      <PlayArrow />
    </StyledIconButton>
  )
);

export default PlayPause;