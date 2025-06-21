import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action) => {
      state.activeSong = action.payload.song;
      state.currentSongs = action.payload.data;
      state.currentIndex = action.payload.i;
      state.isActive = true;
      state.isPlaying = true;
    },

    nextSong: (state, action) => {
      state.activeSong = state.currentSongs[action.payload];
      state.currentIndex = action.payload;
      state.isActive = true;
    },

    prevSong: (state, action) => {
      state.activeSong = state.currentSongs[action.payload];
      state.currentIndex = action.payload;
      state.isActive = true;
    },

    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});

export const { setActiveSong, nextSong, prevSong, togglePlayPause } = playerSlice.actions;
export default playerSlice.reducer;