import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContainer = styled.div`
  background-color: #282828;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.95)'};
  transition: transform 0.3s ease;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiInputBase-root {
      background-color: #3e3e3e;
      border-radius: 4px;
    }
    .MuiInputBase-input {
      color: white;
      &::placeholder {
        color: #b3b3b3;
      }
    }
    .MuiOutlinedInput-notchedOutline {
      border: 1px solid #535353;
    }
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #737373;
    }
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #1DB954;
    }
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

const CreatePlaylistModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim());
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <ModalBackdrop isOpen={isOpen} onClick={onClose}>
      <ModalContainer isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <ModalTitle>Create a new playlist</ModalTitle>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <ActionsContainer>
          <Button onClick={onClose} sx={{ color: '#b3b3b3' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreate}
            disabled={!name.trim()}
            sx={{ 
              backgroundColor: '#1DB954', 
              '&:hover': { backgroundColor: '#1ed760' },
              borderRadius: '500px',
              fontWeight: 'bold'
            }}
          >
            Create
          </Button>
        </ActionsContainer>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default CreatePlaylistModal; 