import React from 'react';
import { WelcomePage } from './WelcomePage';
import { TodoItemsPage } from './TodoItemsPage';
import { RealmAppProvider, useRealmApp } from './RealmApp';

import config from '../realm.json';

const { appId } = config;

export default function AppWithRealm() {
  return (
    <RealmAppProvider appId={appId}>
      <App />
    </RealmAppProvider>
  );
}

function App() {
  const { currentUser, logOut } = useRealmApp();
  return (
    <div className="App">
      <div>
        <div>
          <div>Sample App</div>
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
      {currentUser ? <TodoItemsPage /> : <WelcomePage />}
    </div>
  );
}
