import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Typography, IconButton } from '@mui/material';
import { PlayArrow, Pause, AccessTime, FavoriteBorder } from '@mui/icons-material';
import { setActiveSong, togglePlayPause } from '../redux/features/playerSlice';
import { useSearchTracksQuery } from '../redux/services/spotifyApi';
import { usePlaylists } from '../hooks/usePlaylists';
import Loader from '../components/common/Loader';
import Error from '../components/common/Error';

const PlaylistContainer = styled.div`
  color: white;
`;

const PlaylistHeader = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 32px;
  gap: 24px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
`;

const PlaylistCover = styled.img`
  width: 232px;
  height: 232px;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
`;

const PlaylistInfo = styled.div`
  flex: 1;
`;

const PlayButton = styled(IconButton)`
  && {
    width: 56px;
    height: 56px;
    background-color: #1DB954;
    margin-top: 32px;
    margin-right: 16px;
    
    &:hover {
      background-color: #1ed760;
      transform: scale(1.04);
    }
  }
`;

const LikeButton = styled(IconButton)`
  && {
    color: #b3b3b3;
    &:hover {
      color: white;
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

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TrackTitle = styled.div`
  color: white;
`;

const TrackArtist = styled.div`
  color: #b3b3b3;
`;

const Duration = styled.div`
  color: #b3b3b3;
  text-align: right;
`;

function Playlist() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { getPlaylistById } = usePlaylists();

  const playlistDetails = getPlaylistById(id);
  
  // Use playlist name for the search query, or the ID as a fallback
  const searchQuery = playlistDetails?.name || id;
  const { data: tracks, error, isLoading } = useSearchTracksQuery(searchQuery);

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

  if (isLoading) return <Loader title="Loading playlist..." />;
  if (error) return <Error />;
  if (!playlistDetails) return <Error title="Playlist not found" />;

  const playlist = {
    name: playlistDetails.name,
    description: `A collection of the top ${playlistDetails.name} tracks.`,
    images: [{ url: tracks?.[0]?.images?.coverart || 'https://via.placeholder.com/232' }],
    owner: { display_name: "Spotify" }
  };

  return (
    <PlaylistContainer>
      <PlaylistHeader>
        <PlaylistCover src={playlist.images[0].url} alt={playlist.name} />
        <PlaylistInfo>
          <Typography variant="overline">PLAYLIST</Typography>
          <Typography variant="h1" sx={{ fontSize: '96px', fontWeight: 'bold', marginBottom: 2 }}>
            {playlist.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {playlist.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Created by <b>{playlist.owner.display_name}</b> • {tracks?.length || 0} songs
          </Typography>
          <div>
            <PlayButton onClick={handlePlayPause}>
              {isPlaying && activeSong?.id === tracks[0]?.id ? <Pause /> : <PlayArrow />}
            </PlayButton>
            <LikeButton>
              <FavoriteBorder />
            </LikeButton>
          </div>
        </PlaylistInfo>
      </PlaylistHeader>

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
            <TrackInfo>
              <img 
                src={track.images?.coverart} 
                alt={track.title} 
                style={{ width: 40, height: 40 }}
              />
              <div>
                <TrackTitle>{track.title}</TrackTitle>
                <TrackArtist>{track.subtitle}</TrackArtist>
              </div>
            </TrackInfo>
            <TrackArtist>{track.subtitle}</TrackArtist>
            <TrackArtist>Today</TrackArtist>
            <Duration>{formatDuration(track.duration)}</Duration>
          </TrackRow>
        ))}
      </TracksSection>
    </PlaylistContainer>
  );
}

export default Playlist;