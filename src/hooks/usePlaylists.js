import React, { useState, useEffect, useMemo } from 'react';
import { useSearchTracksQuery } from '../redux/services/spotifyApi';

const USER_PLAYLISTS_KEY = 'spotify-clone-user-playlists';

const samplePlaylistsData = [
  { id: 'liked-songs', name: 'Liked Songs', icon: '❤️' },
  { id: 'discover-weekly', name: 'Discover Weekly', icon: '🎵' },
  { id: 'release-radar', name: 'Release Radar', icon: '📻' },
  { id: 'daily-mix-1', name: 'Daily Mix 1', icon: '🎧' },
  { id: 'daily-mix-2', name: 'Daily Mix 2', icon: '🎧' },
  { id: 'time-capsule', name: 'Time Capsule', icon: '⏰' },
  { id: 'on-repeat', name: 'On Repeat', icon: '🔁' },
  { id: 'recently-played', name: 'Recently Played', icon: '🕒' }
];

export function usePlaylists() {
  const { data: tracks, isLoading, error } = useSearchTracksQuery('top hits', {
    // Prevent fetching tracks if we don't need them
    skip: !samplePlaylistsData,
  });

  const [userPlaylists, setUserPlaylists] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_PLAYLISTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse user playlists from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(USER_PLAYLISTS_KEY, JSON.stringify(userPlaylists));
    } catch (e) {
      console.error("Failed to save user playlists to localStorage", e);
    }
  }, [userPlaylists]);

  const samplePlaylists = useMemo(() => {
    return samplePlaylistsData.map(p => ({
      ...p,
      count: tracks?.length ? Math.floor(Math.random() * tracks.length) + 5 : 0,
    }));
  }, [tracks]);

  const allPlaylists = useMemo(() => [...samplePlaylists, ...userPlaylists], [samplePlaylists, userPlaylists]);
  
  const getPlaylistById = (id) => {
    return allPlaylists.find(p => p.id === id);
  };

  const createPlaylist = (name) => {
    if (!name) return;
    const newPlaylist = {
      id: `user-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name,
      icon: '🎶',
      count: 0,
      isUserCreated: true,
    };
    setUserPlaylists(prev => [...prev, newPlaylist]);
  };

  return { allPlaylists, createPlaylist, getPlaylistById, isLoading, error };
} 