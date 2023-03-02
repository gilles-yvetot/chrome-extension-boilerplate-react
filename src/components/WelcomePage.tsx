import React, { FormEvent } from 'react';
import * as Realm from 'realm-web';

import { useRealmApp } from './RealmApp';
import { MoreInfoTemplateAndDocs } from './MoreInfo';
import { toggleBoolean } from '../utils';
import { useErrorAlert } from '../hooks/useErrorAlert';

type ErrorsType = {
  email: string | null;
  password: string | null;
  other: string | null;
};

// Authentication errors
const noErrors: ErrorsType = {
  email: null,
  password: null,
  other: null,
};

export function WelcomePage() {
  const realmApp = useRealmApp();
  // Track whether the user is logging in or signing up for a new account
  const [isSignup, setIsSignup] = React.useState(false);
  const toggleIsSignup = () => {
    clearErrors();
    setIsSignup(toggleBoolean);
  };

  const [error, setError] = React.useState<ErrorsType>(noErrors);
  const clearErrors = () => setError(noErrors);
  const NonAuthErrorAlert = useErrorAlert({
    error: error.other,
    clearError: () => {
      setError((prevError) => ({ ...prevError, other: null }));
    },
  });
  // Manage password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => setShowPassword(toggleBoolean);

  const onFormSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    clearErrors();
    try {
      if (isSignup) {
        await realmApp.emailPasswordAuth.registerUser({ email, password });
      }
      await realmApp.logIn(Realm.Credentials.emailPassword(email, password));
    } catch (err: any) {
      handleAuthenticationError(err, setError);
    }
  };

  return (
    <div className="main-container">
      <div className="auth-card">
        <form
          className="auth-form"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const { email, password } = Object.fromEntries(formData.entries());
            onFormSubmit({ email: String(email), password: String(password) });
          }}
        >
          <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
          <NonAuthErrorAlert />
          <input id="input-email" name="email" placeholder="Email Address" />
          <input
            id="input-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
          />
          <button
            aria-label="toggle password visibility"
            onClick={toggleShowPassword}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          >
            {showPassword ? `visible` : `not-visible`}
          </button>

          <button type="submit" color="primary">
            {isSignup ? 'Create Account' : 'Log In'}
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => toggleIsSignup()}
          >
            {isSignup
              ? 'Already have an account? Log In'
              : 'Sign up for an account'}
          </button>
        </form>
      </div>
      <MoreInfoTemplateAndDocs />
    </div>
  );
}

function handleAuthenticationError(
  err: any,
  setError: React.Dispatch<React.SetStateAction<ErrorsType>>
) {
  const handleUnknownError = () => {
    setError((prevError: ErrorsType) => ({
      ...prevError,
      other: 'Something went wrong. Try again in a little bit.',
    }));
    console.warn(
      'Something went wrong with a Realm login or signup request. See the following error for details.'
    );
    console.error(err);
  };
  if (err instanceof Realm.MongoDBRealmError) {
    const { error, statusCode } = err;
    const errorType = error || statusCode;
    switch (errorType) {
      case 'invalid username':
        setError((prevError: ErrorsType) => ({
          ...prevError,
          email: 'Invalid email address.',
        }));
        break;
      case 'invalid username/password':
      case 'invalid password':
      case 401:
        setError((prevError: ErrorsType) => ({
          ...prevError,
          password: 'Incorrect password.',
        }));
        break;
      case 'name already in use':
      case 409:
        setError((prevError: ErrorsType) => ({
          ...prevError,
          email: 'Email is already registered.',
        }));
        break;
      case 'password must be between 6 and 128 characters':
      case 400:
        setError((prevError: ErrorsType) => ({
          ...prevError,
          password: 'Password must be between 6 and 128 characters.',
        }));
        break;
      default:
        handleUnknownError();
        break;
    }
  } else {
    handleUnknownError();
  }
}
