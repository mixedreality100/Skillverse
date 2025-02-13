import React from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';

export default function Home() {
  const { redirectToSignIn } = useClerk();
  const { user } = useUser();

  const handleLogin = () => {
    redirectToSignIn(); // Redirects user to Clerk's sign-in page
  };

  return (
    <>
      <h1>Login</h1>
      {user ? (
        <div>
          <p>Welcome, {user.firstName}!</p>
          <button onClick={() => { /* Handle logout */ }}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Clerk</button>
      )}
    </>
  );
} 