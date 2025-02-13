import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export default function JWTFetcher() {
  const { getToken } = useAuth(); // useAuth() must be used inside a component
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    async function fetchToken() {
      try {
        const token = await getToken();
        console.log("JWT:", token);
        setJwt(token); // Store the JWT in state
      } catch (error) {
        console.error("Error fetching JWT:", error);
      }
    }

    fetchToken();
  }, [getToken]); // Dependency array ensures it runs when `getToken` changes

  return (
    <div>
      <h2>Your JWT Token:</h2>
      <pre>{jwt || "Fetching token..."}</pre>
    </div>
  );
}
