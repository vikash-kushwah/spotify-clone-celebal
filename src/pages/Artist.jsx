import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Typography, IconButton } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { setActiveSong, togglePlayPause } from '../redux/features/playerSlice';
import { useSearchTracksQuery } from '../redux/services/spotifyApi';
import Loader from '../components/common/Loader';
import Error from '../components/common/Error';

const ArtistContainer = styled.div`
  color: white;
`;

const ArtistHeader = styled.div`
  height: 40vh;
  min-height: 340px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(transparent 0%, rgba(0,0,0,0.8) 100%);
  }
`;

const ArtistImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const ArtistInfo = styled.div`
  position: relative;
  z-index: 1;
`;

const PlayButton = styled(IconButton)`
  && {
    width: 56px;
    height: 56px;
    background-color: #1DB954;
    margin-top: 32px;
    
    &:hover {
      background-color: #1ed760;
      transform: scale(1.04);
    }
  }
`;

const ContentSection = styled.div`
  padding: 32px;
`;

const PopularTrack = styled.div`
  display: grid;
  grid-template-columns: 16px 6fr 4fr minmax(120px, 1fr);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const TrackNumber = styled.span`
  color: #b3b3b3;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TrackTitle = styled.div`
  color: white;
`;

const Duration = styled.div`
  color: #b3b3b3;
  text-align: right;
`;

function Artist() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: tracks, error, isLoading } = useSearchTracksQuery(id);

  const handlePlayPause = () => {
    if (!tracks?.length) return;
    
    if (activeSong?.id === tracks[0].id) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setActiveSong({ song: tracks[0], data: tracks, i: 0 }));
    }
  };

  const handleTrackClick = (track, i) => {
    dispatch(setActiveSong({ song: track, data: tracks, i }));
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  if (isLoading) return <Loader title="Loading artist..." />;
  if (error) return <Error />;
  if (!tracks?.length) return <Error title="Artist not found" />;

  const artist = {
    name: tracks[0].subtitle,
    image: tracks[0].images?.coverart,
    monthlyListeners: Math.floor(Math.random() * 1000000) + 100000
  };

  return (
    <ArtistContainer>
      <ArtistHeader>
        <ArtistImage src={artist.image} alt={artist.name} />
        <ArtistInfo>
          <Typography variant="h1" sx={{ fontSize: '96px', fontWeight: 'bold', marginBottom: 2 }}>
            {artist.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {artist.monthlyListeners.toLocaleString()} monthly listeners
          </Typography>
          <PlayButton onClick={handlePlayPause}>
            {isPlaying && activeSong?.id === tracks[0]?.id ? <Pause /> : <PlayArrow />}
          </PlayButton>
        </ArtistInfo>
      </ArtistHeader>

      <ContentSection>
        <Typography variant="h5" gutterBottom>
          Popular
        </Typography>

        {tracks.map((track, index) => (
          <PopularTrack 
            key={track.id} 
            onClick={() => handleTrackClick(track, index)}
            style={{
              backgroundColor: activeSong?.id === track.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <TrackNumber>{index + 1}</TrackNumber>
            <TrackInfo>
              <img 
                src={track.images?.coverart} 
                alt={track.title} 
                style={{ width: 40, height: 40 }}
              />
              <TrackTitle>{track.title}</TrackTitle>
            </TrackInfo>
            <span style={{ color: '#b3b3b3' }}>{track.subtitle}</span>
            <Duration>{formatDuration(track.duration)}</Duration>
          </PopularTrack>
        ))}
      </ContentSection>
    </ArtistContainer>
  );
}

export default Artist;