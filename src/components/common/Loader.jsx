import React from 'react';
import { CircularProgress } from '@mui/material';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
`;

const LoaderText = styled.h1`
  font-size: 24px;
  color: white;
  text-align: center;
`;

const Loader = ({ title = 'Loading...' }) => (
  <LoaderContainer>
    <CircularProgress size={64} thickness={4} color="primary" />
    <LoaderText>{title}</LoaderText>
  </LoaderContainer>
);

export default Loader;