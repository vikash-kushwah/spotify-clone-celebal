import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  background-color: #121212;
`;

const ErrorMessage = styled.h1`
  font-size: 28px;
  color: white;
  text-align: center;
`;

const Error = ({ title = 'Something went wrong. Please try again.' }) => (
  <ErrorContainer>
    <ErrorMessage>{title}</ErrorMessage>
  </ErrorContainer>
);

export default Error;