import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Typography, IconButton } from '@mui/material';
import { PlayArrow, Pause, AccessTime } from '@mui/icons-material';
import { setActiveSong, togglePlayPause } from '../redux/features/playerSlice';
import { useGetTrackByIdQuery } from '../redux/services/spotifyApi';
import Loader from '../components/common/Loader';
import Error from '../components/common/Error';

const AlbumContainer = styled.div`
  color: white;
`;

const AlbumHeader = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 32px;
  gap: 24px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
`;

const AlbumCover = styled.img`
  width: 232px;
  height: 232px;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
`;

const AlbumInfo = styled.div`
  flex: 1;
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

const TracksSection = styled.div`
  padding: 0 32px;
`;

const TrackRow = styled.div`
  display: grid;
  grid-template-columns: 16px 6fr 4fr 3fr minmax(120px, 1fr);
  padding: 8px 16px;
  color: #b3b3b3;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const TrackNumber = styled.span`
  color: #b3b3b3;
`;

const TrackTitle = styled.div`
  color: white;
  margin-right: 16px;
`;

const TrackArtist = styled.div`
  color: #b3b3b3;
`;

const Duration = styled.div`
  color: #b3b3b3;
  text-align: right;
`;

function Album() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: album, error, isLoading } = useGetTrackByIdQuery(id);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (album) {
      // Transform album data to tracks array
      setTracks([album]); // For now, just use the single track
    }
  }, [album]);

  const handlePlayPause = () => {
    if (tracks.length === 0) return;
    
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

  if (isLoading) return <Loader title="Loading album..." />;
  if (error) return <Error />;
  if (!album) return <Error title="Album not found" />;

  return (
    <AlbumContainer>
      <AlbumHeader>
        <AlbumCover src={album.images?.coverart} alt={album.title} />
        <AlbumInfo>
          <Typography variant="overline">ALBUM</Typography>
          <Typography variant="h1" sx={{ fontSize: '96px', fontWeight: 'bold', marginBottom: 2 }}>
            {album.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {album.subtitle} • {new Date().getFullYear()} • {tracks.length} songs
          </Typography>
          <PlayButton onClick={handlePlayPause}>
            {isPlaying && activeSong?.id === tracks[0]?.id ? <Pause /> : <PlayArrow />}
          </PlayButton>
        </AlbumInfo>
      </AlbumHeader>

      <TracksSection>
        <TrackRow style={{ margin: '16px 0', color: '#b3b3b3' }}>
          <span>#</span>
          <span>TITLE</span>
          <span>ARTIST</span>
          <span>ALBUM</span>
          <AccessTime fontSize="small" />
        </TrackRow>

        {tracks.map((track, index) => (
          <TrackRow 
            key={track.id} 
            onClick={() => handleTrackClick(track, index)}
            style={{
              backgroundColor: activeSong?.id === track.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <TrackNumber>{index + 1}</TrackNumber>
            <TrackTitle>{track.title}</TrackTitle>
            <TrackArtist>{track.subtitle}</TrackArtist>
            <TrackArtist>{album.title}</TrackArtist>
            <Duration>{formatDuration(track.duration)}</Duration>
          </TrackRow>
        ))}
      </TracksSection>
    </AlbumContainer>
  );
}

export default Album;