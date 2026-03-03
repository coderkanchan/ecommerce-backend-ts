'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {

    console.error("Critical Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-gray-900 border border-red-500/20 p-8 rounded-3xl shadow-2xl max-w-md">
        <h2 className="text-4xl mb-4">Oops! 😵‍💫</h2>
        <h3 className="text-xl font-bold text-white mb-2">Something went wrong!</h3>
        <p className="text-gray-400 mb-6">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition"
          >
            Try Again
          </button>
          <a href="/" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-bold transition">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}