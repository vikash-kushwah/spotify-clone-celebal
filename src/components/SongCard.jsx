import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PlayPause from './PlayPause';

const CardContainer = styled.div`
  flex: 0 0 250px;
  padding: 15px;
  background-color: var(--bg-elevated);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-4px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 100%;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const PlayPauseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const Title = styled(Link)`
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    color: var(--text-primary);
  }
`;

const Subtitle = styled(Link)`
  color: var(--text-secondary);
  font-size: 14px;
  text-decoration: none;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    color: var(--text-primary);
  }
`;

const SongCard = ({ song, isPlaying, activeSong, i, data, onPlayPause }) => {
  const handlePauseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayPause();
  };

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayPause();
  };

  return (
    <CardContainer>
      <ImageContainer>
        <Image
          src={song.images?.coverart}
          alt={song.title}
        />
        <PlayPauseOverlay>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </PlayPauseOverlay>
      </ImageContainer>

      <Title to={`/songs/${song?.id}`}>
        {song.title}
      </Title>
      <Subtitle to={song.artists ? `/artist/${song.id}` : '/top-artists'}>
        {song.subtitle}
      </Subtitle>
    </CardContainer>
  );
};

export default SongCard;