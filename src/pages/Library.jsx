import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Typography, Tabs, Tab, Grid } from '@mui/material';
import { useSearchTracksQuery } from '../redux/services/spotifyApi';
import Loader from '../components/common/Loader';
import Error from '../components/common/Error';

const LibraryContainer = styled.div`
  padding: 20px;
`;

const TabPanel = styled.div`
  padding: 24px 0;
`;

const ItemCard = styled.div`
  background-color: #181818;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #282828;
    transform: translateY(-4px);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  margin-bottom: 16px;
  border-radius: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #b3b3b3;
`;

function Library() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const { data: tracks, error, isLoading } = useSearchTracksQuery('top hits');
  const { activeSong } = useSelector((state) => state.player);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };

  const handleAlbumClick = (album) => {
    navigate(`/album/${album.id}`);
  };

  if (isLoading) return <Loader title="Loading library..." />;
  if (error) return <Error />;

  // Create playlists from tracks
  const playlists = [
    {
      id: 'liked-songs',
      name: 'Liked Songs',
      images: [{ url: tracks?.[0]?.images?.coverart }],
      owner: { display_name: 'You' }
    },
    {
      id: 'discover-weekly',
      name: 'Discover Weekly',
      images: [{ url: tracks?.[1]?.images?.coverart }],
      owner: { display_name: 'Spotify' }
    }
  ];

  // Create albums from tracks
  const albums = tracks?.reduce((acc, track) => {
    const existingAlbum = acc.find(a => a.name === track.title);
    if (!existingAlbum) {
      acc.push({
        id: track.id,
        name: track.title,
        images: [{ url: track.images?.coverart }],
        artists: [{ name: track.subtitle }]
      });
    }
    return acc;
  }, []) || [];

  return (
    <LibraryContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Library
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
          }
        }}
      >
        <Tab label="Playlists" />
        <Tab label="Albums" />
      </Tabs>

      <TabPanel hidden={tab !== 0}>
        {playlists.length > 0 ? (
          <Grid container spacing={3}>
            {playlists.map((playlist) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={playlist.id}>
                <ItemCard onClick={() => handlePlaylistClick(playlist)}>
                  <ItemImage 
                    src={playlist.images[0]?.url} 
                    alt={playlist.name}
                  />
                  <Typography variant="h6" component="h3">
                    {playlist.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    By {playlist.owner.display_name}
                  </Typography>
                </ItemCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState>
            <Typography variant="h6">Create your first playlist</Typography>
            <Typography variant="body1">It's easy, we'll help you</Typography>
          </EmptyState>
        )}
      </TabPanel>

      <TabPanel hidden={tab !== 1}>
        {albums.length > 0 ? (
          <Grid container spacing={3}>
            {albums.map((album) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
                <ItemCard 
                  onClick={() => handleAlbumClick(album)}
                  style={{
                    backgroundColor: activeSong?.id === album.id ? 'rgba(255, 255, 255, 0.1)' : undefined
                  }}
                >
                  <ItemImage 
                    src={album.images[0]?.url} 
                    alt={album.name}
                  />
                  <Typography variant="h6" component="h3">
                    {album.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {album.artists.map(artist => artist.name).join(', ')}
                  </Typography>
                </ItemCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState>
            <Typography variant="h6">No saved albums yet</Typography>
            <Typography variant="body1">Find some albums you like</Typography>
          </EmptyState>
        )}
      </TabPanel>
    </LibraryContainer>
  );
}

export default Library;
