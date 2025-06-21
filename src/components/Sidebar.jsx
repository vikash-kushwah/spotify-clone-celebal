import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Home, Search, LibraryMusic, Add } from '@mui/icons-material';
import { usePlaylists } from '../hooks/usePlaylists';
import CreatePlaylistModal from './common/CreatePlaylistModal';

const SidebarContainer = styled.div`
  width: 240px;
  flex: 0 0 240px;
  min-width: 240px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  
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

const Logo = styled.img`
  height: 40px;
  margin-bottom: 30px;
`;

const NavMenu = styled.div`
  margin-bottom: 30px;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  padding: 10px 0;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const NavIcon = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
`;

const PlaylistSection = styled.div`
  border-top: 1px solid #282828;
  padding-top: 20px;
`;

const PlaylistTitle = styled.h2`
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const PlaylistItem = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 0;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  
  &:hover {
    color: var(--text-primary);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PlaylistIcon = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  color: #b3b3b3;
`;

const PlaylistName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CreatePlaylistButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-bottom: 16px;
  
  &:hover {
    color: var(--text-primary);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PlaylistCount = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  margin-top: 8px;
  padding-left: 27px;
`;

const LoadingText = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  padding: 8px 0;
  font-style: italic;
`;

const ErrorText = styled.div`
  color: #e91429;
  font-size: 12px;
  padding: 8px 0;
`;

function Sidebar() {
  const { allPlaylists, createPlaylist, isLoading, error } = usePlaylists();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePlaylist = (name) => {
    createPlaylist(name);
  };

  return (
    <>
      <SidebarContainer>
        <Logo src="/spotify-logo.png" alt="Spotify" />
        
        <NavMenu>
          <NavItem to="/">
            <NavIcon><Home /></NavIcon>
            Home
          </NavItem>
          <NavItem to="/search">
            <NavIcon><Search /></NavIcon>
            Search
          </NavItem>
          <NavItem to="/library">
            <NavIcon><LibraryMusic /></NavIcon>
            Your Library
          </NavItem>
        </NavMenu>
        
        <PlaylistSection>
          <PlaylistTitle>Playlists</PlaylistTitle>
          
          <CreatePlaylistButton onClick={() => setIsModalOpen(true)}>
            <NavIcon><Add /></NavIcon>
            Create Playlist
          </CreatePlaylistButton>
          
          {isLoading && (
            <LoadingText>Loading playlists...</LoadingText>
          )}
          
          {error && (
            <ErrorText>Failed to load playlists</ErrorText>
          )}
          
          {allPlaylists.map((playlist) => (
            <PlaylistItem key={playlist.id} to={`/playlist/${playlist.id}`}>
              <PlaylistIcon>
                {playlist.icon}
              </PlaylistIcon>
              <PlaylistName>{playlist.name}</PlaylistName>
            </PlaylistItem>
          ))}
          
          {allPlaylists.length > 0 && (
            <PlaylistCount>
              {allPlaylists.length} playlists
            </PlaylistCount>
          )}
        </PlaylistSection>
      </SidebarContainer>

      <CreatePlaylistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </>
  );
}

export default Sidebar;
