import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchTracksQuery, useGetTopChartsQuery, useGetNewReleasesQuery } from '../redux/services/spotifyApi';
import { Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import SongCard from '../components/SongCard';
import Loader from '../components/common/Loader';
import Error from '../components/common/Error';
import { setActiveSong, togglePlayPause } from '../redux/features/playerSlice';

const HomeContainer = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const GradientBackground = styled.div`
  background: linear-gradient(to bottom, #450af5, #121212);
  padding: 60px 20px;
  margin: -20px -20px 20px -20px;
  border-radius: 8px;
`;

const WelcomeText = styled(Typography)`
  color: white;
  margin-bottom: 24px !important;
`;

const SectionTitle = styled(Typography)`
  color: white;
  margin-bottom: 24px !important;
  font-size: 24px !important;
  font-weight: bold !important;
`;

function Home() {
  const { data: recommendedTracks, error: recommendedError, isLoading: recommendedLoading } = useSearchTracksQuery('top hits');
  const { data: topCharts, error: chartsError, isLoading: chartsLoading } = useGetTopChartsQuery();
  const { data: newReleases, error: releasesError, isLoading: releasesLoading } = useGetNewReleasesQuery();
  const { activeSong, isPlaying, isActive } = useSelector((state) => state.player);
  const dispatch = useDispatch();

  // On first load, prime the player with a track but do **not** override if the user
  // has already selected something.
  useEffect(() => {
    if (!isActive && recommendedTracks?.length) {
      const firstTrack = recommendedTracks[0];
      dispatch(setActiveSong({ song: firstTrack, data: recommendedTracks, i: 0 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedTracks, isActive]);

  const handlePlayPause = (song, i, data) => {
    if (activeSong?.id === song.id) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setActiveSong({ song, data, i }));
    }
  };

  if (recommendedLoading || chartsLoading || releasesLoading) {
    return <Loader title="Loading music..." />;
  }

  if (recommendedError || chartsError || releasesError) {
    return <Error />;
  }

  return (
    <HomeContainer>
      <GradientBackground>
        <WelcomeText variant="h3" component="h1">
          Welcome to Spotify
        </WelcomeText>
      </GradientBackground>

      <Section>
        <SectionTitle variant="h5" component="h2">
          Recommended for You
        </SectionTitle>
        <Grid container spacing={3}>
          {recommendedTracks?.map((song, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${song.id ?? ''}-${i}`}>
              <SongCard
                song={song}
                isPlaying={isPlaying}
                activeSong={activeSong}
                data={recommendedTracks}
                i={i}
                onPlayPause={() => handlePlayPause(song, i, recommendedTracks)}
              />
            </Grid>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle variant="h5" component="h2">
          Top Charts
        </SectionTitle>
        <Grid container spacing={3}>
          {topCharts?.slice(0, 4).map((song, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${song.id ?? ''}-${i}`}>
              <SongCard
                song={song}
                isPlaying={isPlaying}
                activeSong={activeSong}
                data={topCharts}
                i={i}
                onPlayPause={() => handlePlayPause(song, i, topCharts)}
              />
            </Grid>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle variant="h5" component="h2">
          New Releases
        </SectionTitle>
        <Grid container spacing={3}>
          {newReleases?.slice(0, 4).map((song, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${song.id ?? ''}-${i}`}>
              <SongCard
                song={song}
                isPlaying={isPlaying}
                activeSong={activeSong}
                data={newReleases}
                i={i}
                onPlayPause={() => handlePlayPause(song, i, newReleases)}
              />
            </Grid>
          ))}
        </Grid>
      </Section>
    </HomeContainer>
  );
}

export default Home;
