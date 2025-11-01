import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

// Mock the Sanity client to simulate CMS data fetching
import * as sanity from './lib/sanity';
jest.mock('./lib/sanity', () => ({
  client: {
    fetch: jest.fn(() => Promise.resolve([])),
  },
}));

// Define all routes to test
const routesToTest = [
  '/homepage',
  '/character-universe',
  '/community-gallery',
  '/lookbook-explorer',
  '/interactive-experience-center',
  '/creator-s-lab',
  '/cultural-map',
  '/personal-dashboard',
  '/knowledge-hub',
  '/admin-dashboard',
  '/shop',
];

describe('Route Validation', () => {
  test.each(routesToTest)('renders %s without crashing', async (route) => {
    // Mock window.history to simulate navigation to the route
    window.history.pushState({}, '', route);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Check if the page renders some content (not a 404 or error)
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
    // We can add more specific checks if needed for each route
  });

  test('renders 404 for non-existent route', () => {
    window.history.pushState({}, '', '/non-existent-route');

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
