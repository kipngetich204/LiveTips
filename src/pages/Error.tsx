export function ErrorPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="text-center max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <div className="text-red-500 text-5xl font-bold mb-4">⚠️</div>

        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>

        <p className="text-gray-300 mb-6">
          {message || "An unexpected error occurred."}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 transition rounded-lg font-semibold"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
