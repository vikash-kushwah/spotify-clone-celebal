import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Typography, TextField, Grid, Chip } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { setActiveSong } from '../redux/features/playerSlice';
import { useSearchTracksQuery } from '../redux/services/spotifyApi';
import Loader from '../components/common/Loader';
import Error from '../components/common/Error';

const SearchContainer = styled.div`
  padding: 20px;
`;

const SearchBar = styled.div`
  margin-bottom: 32px;
  position: relative;
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      background-color: #242424;
      border-radius: 500px;
      transition: all 0.3s ease;
      border: 1px solid transparent;
      
      &:hover {
        background-color: #2a2a2a;
        border-color: #404040;
      }
      
      &.Mui-focused {
        background-color: #2a2a2a;
        border-color: #1DB954;
        box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.2);
      }
      
      .MuiOutlinedInput-notchedOutline {
        border: none;
      }
      
      .MuiInputBase-input {
        color: white;
        font-size: 16px;
        padding: 16px 20px;
        
        &::placeholder {
          color: #b3b3b3;
          opacity: 1;
        }
      }
      
      .MuiInputAdornment-root {
        color: #b3b3b3;
        margin-left: 8px;
        
        .MuiSvgIcon-root {
          font-size: 24px;
        }
      }
    }
  }
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #b3b3b3;
  transition: color 0.3s ease;
  
  ${StyledTextField}:focus-within & {
    color: #1DB954;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .MuiSvgIcon-root {
    font-size: 20px;
  }
`;

const SearchSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #282828;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transform: translateY(${props => props.visible ? '0' : '-10px'});
  transition: all 0.3s ease;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #404040;
    border-radius: 4px;
  }
`;

const SuggestionItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #404040;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const SuggestionIcon = styled.div`
  color: #b3b3b3;
  display: flex;
  align-items: center;
`;

const SuggestionText = styled.div`
  color: white;
  font-size: 14px;
`;

const SearchStats = styled.div`
  margin-top: 8px;
  color: #b3b3b3;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchDot = styled.div`
  width: 4px;
  height: 4px;
  background-color: #b3b3b3;
  border-radius: 50%;
`;

const GenreSection = styled.div`
  margin-bottom: 32px;
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

const GenreCard = styled.div`
  position: relative;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: ${props => props.color || '#1DB954'};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const GenreTitle = styled(Typography)`
  position: absolute;
  top: 16px;
  left: 16px;
  font-weight: bold !important;
  font-size: 24px !important;
`;

const GenreImage = styled.img`
  position: absolute;
  bottom: -5%;
  right: -5%;
  width: 100px;
  height: 100px;
  transform: rotate(25deg);
`;

const ResultsSection = styled.div`
  margin-top: 32px;
`;

const TrackCard = styled.div`
  background-color: #181818;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #282828;
  }
`;

const TrackImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  margin-bottom: 16px;
  border-radius: 4px;
`;

const genres = [
  { id: 1, name: 'Pop', color: '#FF4081', image: 'https://i.scdn.co/image/ab67706f000000020377baccf69ede3cf1a26eff' },
  { id: 2, name: 'Hip-Hop', color: '#7C4DFF', image: 'https://i.scdn.co/image/ab67706f000000025f0ff9251e3cfe641160dc31' },
  { id: 3, name: 'Rock', color: '#FF6E40', image: 'https://i.scdn.co/image/ab67706f00000002fe6d8d1019d5b302213e3730' },
  { id: 4, name: 'Electronic', color: '#00B8D4', image: 'https://i.scdn.co/image/ab67706f000000025f7327d3fdc71af27917adba' },
  { id: 5, name: 'Jazz', color: '#FFD740', image: 'https://i.scdn.co/image/ab67706f00000002d72ef75e14ca6f60ea2364c2' },
  { id: 6, name: 'Classical', color: '#8D6E63', image: 'https://i.scdn.co/image/ab67706f00000002d72ef75e14ca6f60ea2364c2' },
];

function Search() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: searchResults, error, isLoading } = useSearchTracksQuery(
    debouncedSearch || selectedGenre || 'top hits',
    { skip: !debouncedSearch && !selectedGenre }
  );

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Show suggestions when typing
  useEffect(() => {
    setShowSuggestions(searchTerm.length > 0 && searchTerm.length < 3);
  }, [searchTerm]);

  const handleTrackClick = (song, i) => {
    dispatch(setActiveSong({ song, data: searchResults, i }));
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(selectedGenre === genre.name ? null : genre.name);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (searchTerm.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // Common search suggestions
  const searchSuggestions = [
    { text: 'Top hits', icon: '🎵' },
    { text: 'Pop music', icon: '🎤' },
    { text: 'Rock classics', icon: '🎸' },
    { text: 'Hip hop', icon: '🎧' },
    { text: 'Jazz', icon: '🎷' },
    { text: 'Electronic', icon: '🎹' },
  ];

  if (isLoading) return <Loader title="Searching..." />;
  if (error) return <Error />;

  return (
    <SearchContainer>
      <SearchBar>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="What do you want to listen to?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          InputProps={{
            startAdornment: (
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
            ),
            endAdornment: searchTerm.length > 0 && (
              <ClearButton visible={true} onClick={handleClearSearch}>
                <ClearIcon />
              </ClearButton>
            )
          }}
        />
        
        <SearchSuggestions visible={showSuggestions}>
          {searchSuggestions.map((suggestion, index) => (
            <SuggestionItem 
              key={index}
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              <SuggestionIcon>{suggestion.icon}</SuggestionIcon>
              <SuggestionText>{suggestion.text}</SuggestionText>
            </SuggestionItem>
          ))}
        </SearchSuggestions>

        {(searchTerm || selectedGenre) && searchResults && (
          <SearchStats>
            <span>{searchResults.length} results found</span>
            <SearchDot />
            <span>Search for "{debouncedSearch || selectedGenre}"</span>
          </SearchStats>
        )}
      </SearchBar>

      <GenreSection>
        <Typography variant="h5" gutterBottom>
          Browse All
        </Typography>
        {selectedGenre && (
          <Chip
            label={selectedGenre}
            onDelete={() => setSelectedGenre(null)}
            style={{ marginBottom: 16 }}
          />
        )}
        <GenreGrid>
          {genres.map((genre) => (
            <GenreCard
              key={genre.id}
              color={genre.color}
              onClick={() => handleGenreClick(genre)}
              style={{
                opacity: selectedGenre && selectedGenre !== genre.name ? 0.7 : 1
              }}
            >
              <GenreTitle color="white">{genre.name}</GenreTitle>
              <GenreImage src={genre.image} alt={genre.name} />
            </GenreCard>
          ))}
        </GenreGrid>
      </GenreSection>

      {(searchTerm || selectedGenre) && (
        <ResultsSection>
          <Typography variant="h5" gutterBottom>
            Results
          </Typography>
          <Grid container spacing={3}>
            {(searchResults || []).map((track, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${track.id ?? ''}-${index}`}>
                <TrackCard onClick={() => handleTrackClick(track, index)}>
                  <TrackImage src={track.images?.coverart} alt={track.title} />
                  <Typography variant="h6" component="h3">
                    {track.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {track.subtitle}
                  </Typography>
                </TrackCard>
              </Grid>
            ))}
          </Grid>
        </ResultsSection>
      )}
    </SearchContainer>
  );
}

export default Search;
