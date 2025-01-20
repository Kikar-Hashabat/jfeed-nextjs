"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  console.error(error); // Optional: Log the error for debugging

  return (
    <div>
      <h1>Something wsent wrong!</h1> <h1>Something went wrong!</h1>{" "}
      <h1>Something went wrong!</h1> <h1>Something went wrong!</h1>{" "}
      <h1>Something went wrong!</h1> <h1>Something went wrong!</h1>{" "}
      <h1>Something went wrong!</h1> <h1>Something went wrong!</h1>{" "}
      <h1>Something went wrong!</h1> <h1>Something went wrong!</h1>{" "}
      <h1>Something went wrong!</h1> <h1>Something went wrong!</h1>{" "}
      <h1>Something went wrong!</h1> <h1>Something went wrong!</h1>{" "}
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
