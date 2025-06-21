import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { retry } from '@reduxjs/toolkit/query';

// Basic fallback data in case the remote API is unreachable
const fallbackTracks = [
  {
    id: '909253',
    title: 'Everlong',
    subtitle: 'Foo Fighters',
    images: { coverart: 'https://is5-ssl.mzstatic.com/image/thumb/Music125/v4/e6/0d/39/e60d39f7-ebd2-66f1-d25c-ae93e2bf49f4/075679970260.jpg/400x400cc.jpg' },
    duration: 250000,
  },
  {
    id: '1440857781',
    title: 'Billie Jean',
    subtitle: 'Michael Jackson',
    images: { coverart: 'https://is3-ssl.mzstatic.com/image/thumb/Music118/v4/c6/6c/aa/c66caa2d-af81-f4e2-00c6-0bf655fbac12/886445594362.jpg/400x400cc.jpg' },
    duration: 294000,
  },
];

// Helper to extract plain text from RSS objects that wrap their value in `{ label: "..." }`
const plain = (val) => (typeof val === 'object' && val !== null && 'label' in val ? val.label : val);

// General helper to normalise different payload shapes into the track model our UI expects
const normalise = (item) => ({
  id:
    item.trackId ||
    item.collectionId ||
    item['id']?.attributes?.['im:id'] ||
    plain(item.id) ||
    Math.random().toString(36).slice(2),
  title: plain(item.trackName || item.collectionName || item.title) || plain(item['im:name']),
  subtitle: plain(item.artistName || item.subtitle) || plain(item['im:artist']),
  images: {
    coverart:
      item.artworkUrl100 ||
      item.artworkUrl60 ||
      item.images?.coverart ||
      (Array.isArray(item['im:image']) ? item['im:image'][2]?.label : undefined),
  },
  duration: item.trackTimeMillis || item.duration || 0,
  audio: item.previewUrl || item.audio || '',
});

// Wrap fetchBaseQuery to catch errors and serve fallback data
const rawBaseQuery = fetchBaseQuery({ baseUrl: 'https://itunes.apple.com' });

const baseQueryWithFallback = retry(async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error) {
    console.warn('iTunes API error, using fallback data:', result.error);
    return { data: fallbackTracks };
  }
  return result;
}, { maxRetries: 1 });

export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: baseQueryWithFallback,
  keepUnusedDataFor: 3600,
  endpoints: (builder) => ({
    // Free text search (iTunes Search API)
    searchTracks: builder.query({
      query: (term) => `/search?term=${encodeURIComponent(term)}&media=music&limit=25`,
      transformResponse: (response) => {
        try {
          return (response?.results || []).map(normalise);
        } catch (e) {
          console.warn('searchTracks transform failed', e);
          return fallbackTracks;
        }
      },
    }),

    // Top charts using iTunes RSS feed
    getTopCharts: builder.query({
      query: () => `/us/rss/topsongs/limit=25/json`,
      transformResponse: (response) => {
        try {
          const entries = response?.feed?.entry || [];
          return entries.map(normalise);
        } catch (e) {
          console.warn('getTopCharts transform failed', e);
          return fallbackTracks;
        }
      },
    }),

    // New releases (top new-release albums feed)
    getNewReleases: builder.query({
      query: () => `/us/rss/topalbums/limit=25/json`,
      transformResponse: (response) => {
        try {
          const entries = response?.feed?.entry || [];
          return entries.map(normalise);
        } catch (e) {
          console.warn('getNewReleases transform failed', e);
          return fallbackTracks;
        }
      },
    }),

    // Lookup by track id
    getTrackById: builder.query({
      query: (id) => `/lookup?id=${id}`,
      transformResponse: (response) => {
        try {
          const first = (response?.results || [])[0];
          return first ? normalise(first) : fallbackTracks[0];
        } catch (e) {
          console.warn('getTrackById transform failed', e);
          return fallbackTracks[0];
        }
      },
    }),
  }),
});

export const {
  useSearchTracksQuery,
  useGetTopChartsQuery,
  useGetNewReleasesQuery,
  useGetTrackByIdQuery,
} = spotifyApi;