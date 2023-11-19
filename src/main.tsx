import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';
import {
  RouterProvider,
  Router,
  Route,
  RootRoute,
  useNavigate,
} from '@tanstack/react-router';

import App from './App.tsx';
import './index.css';

const rootRoute = new RootRoute();
const appRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});
const goRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/go/$id',
  component: ({ useParams }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    localStorage.setItem('current-prompt', id);
    navigate({ to: '/' });
  },
});
const routeTree = rootRoute.addChildren([appRoute, goRoute]);
const router = new Router({ routeTree });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
