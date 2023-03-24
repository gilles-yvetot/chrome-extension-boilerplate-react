import React from 'react';
import Signup from './Signup';
import Login from './Login';
import { TodoItemsPage } from './TodoItemsPage';
import { RealmAppProvider, useRealmApp } from './RealmApp';
import {
  createMemoryRouter,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';

import config from '../realm.json';

const { appId } = config;

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useRealmApp();
  const navigate = useNavigate();
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  return children;
};

const router = createMemoryRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <TodoItemsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

function App() {
  const { currentUser, logOut } = useRealmApp();
  return (
    <div className="App">
      <div>
        <div>
          <div>Sample App</div>
          <RouterProvider router={router} />
          {currentUser ? (
            <button
              color="secondary"
              onClick={async () => {
                await logOut();
              }}
            >
              Log Out
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function AppWithRealm() {
  return (
    <RealmAppProvider appId={appId}>
      <App />
    </RealmAppProvider>
  );
}
