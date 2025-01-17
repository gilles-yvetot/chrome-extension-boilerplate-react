import React, { ReactNode } from 'react';
import { App, User, Credentials } from 'realm-web';
import config from '../realm.json';

const { baseUrl } = config;

function createRealmApp(id: string) {
  return new App({ id, baseUrl });
}

type RealmContextType =
  | null
  | (App & {
      currentUser: User | null;
      logIn: (credentials: Credentials) => Promise<void>;
      logOut: () => Promise<void>;
    });

const RealmAppContext = React.createContext<RealmContextType>(null);

export function RealmAppProvider({
  appId,
  children,
}: {
  appId: string;
  children: ReactNode;
}) {
  // Store Realm.App in React state. If appId changes, all children will rerender and use the new realmApp.
  const [realmApp, setRealmApp] = React.useState(createRealmApp(appId));
  React.useEffect(() => {
    setRealmApp(createRealmApp(appId));
  }, [appId]);
  // Store the app's current user in state and wrap the built-in auth functions to modify this state
  const [currentUser, setCurrentUser] = React.useState(realmApp.currentUser);
  // Wrap the base logIn function to save the logged in user in state
  const logIn = React.useCallback(
    async (credentials: Credentials) => {
      await realmApp.logIn(credentials);
      setCurrentUser(realmApp.currentUser);
    },
    [realmApp]
  );
  // Wrap the current user's logOut function to remove the logged out user from state
  const logOut = React.useCallback(async () => {
    if (currentUser) {
      await currentUser.logOut();
      await realmApp.removeUser(currentUser);
      setCurrentUser(realmApp.currentUser);
    }
  }, [realmApp, currentUser]);

  // Override the App's currentUser & logIn properties + include the app-level logout function
  const realmAppContext: RealmContextType = React.useMemo(() => {
    return {
      ...realmApp,
      currentUser,
      logIn,
      logOut,
    };
  }, [realmApp, currentUser, logIn, logOut]);

  return (
    <RealmAppContext.Provider value={realmAppContext}>
      {children}
    </RealmAppContext.Provider>
  );
}

export function useRealmApp() {
  const realmApp = React.useContext(RealmAppContext);
  if (!realmApp) {
    throw new Error(
      `No Realm App found. Make sure to call useRealmApp() inside of a <RealmAppProvider />.`
    );
  }
  return realmApp;
}
