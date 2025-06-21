import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import styled from 'styled-components';

// Components
import Sidebar from './components/Sidebar';
import Player from './components/Player';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Album from './pages/Album';
import Artist from './pages/Artist';
import Playlist from './pages/Playlist';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954',
    },
    background: {
      default: '#121212',
      paper: '#181818',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Open Sans',
      'sans-serif'
    ].join(','),
  },
});

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #121212;
`;

const MainContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  
  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 8px;
    border: 4px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const ContentWrapper = styled.div`
  padding: 20px;
  padding-bottom: 90px;
`;

// Define root layout component
const RootLayout = ({ children }) => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <AppContainer>
      <Sidebar />
      <MainContent>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
      <Player />
    </AppContainer>
  </ThemeProvider>
);

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout><Home /></RootLayout>
  },
  {
    path: '/search',
    element: <RootLayout><Search /></RootLayout>
  },
  {
    path: '/library',
    element: <RootLayout><Library /></RootLayout>
  },
  {
    path: '/album/:id',
    element: <RootLayout><Album /></RootLayout>
  },
  {
    path: '/artist/:id',
    element: <RootLayout><Artist /></RootLayout>
  },
  {
    path: '/playlist/:id',
    element: <RootLayout><Playlist /></RootLayout>
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
