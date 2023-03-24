import React, { FormEvent } from 'react';
import * as Realm from 'realm-web';

import { useRealmApp } from './RealmApp';
import { toggleBoolean } from '../utils';
import { useErrorAlert } from '../hooks/useErrorAlert';
import { useNavigate } from 'react-router-dom';
import { handleAuthenticationError } from './Login';

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

export default function Signup() {
  const realmApp = useRealmApp();
  const navigate = useNavigate();
  // Track whether the user is logging in or signing up for a new account
  const goToLogin = () => {
    clearErrors();
    navigate('/login');
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
      await realmApp.emailPasswordAuth.registerUser({ email, password });
      await realmApp.logIn(Realm.Credentials.emailPassword(email, password));
      navigate('/');
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
          <h2>Sign Up</h2>
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
            Create Account
          </button>
          <button type="button" className="link-button" onClick={goToLogin}>
            Already have an account? Log In
          </button>
        </form>
      </div>
    </div>
  );
}
