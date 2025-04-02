import { useState, useEffect } from "react";

const useHandleError = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error && error.statusCode === 403) {
      window.location.href = "/";
    }
  }, [error]);

  const handleError = (graphQLErrors, networkError) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      if (networkError.statusCode === 403) {
        console.log(`[Network error]: 403 Forbidden`);
        setError(networkError);
      } else {
        console.log(`[Network error]: ${networkError}`);
      }
    }
  };

  return handleError;
};

export { useHandleError };
