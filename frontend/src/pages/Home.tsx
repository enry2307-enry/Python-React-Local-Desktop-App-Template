import { useState } from "react";
import { api } from "../api/api";

export default function Home() {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function pingBackend() {
    setLoading(true);
    setResponse("");

    try {
      const result = await api.call<string>("ping");
      setResponse(result);
    } catch (error) {
      setResponse(
        error instanceof Error ? error.message : "Failed to ping backend"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Backend Connection Test</h1>

      <button
        onClick={pingBackend}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Pinging..." : "Ping Backend"}
      </button>

      {response && (
        <p className="rounded-lg bg-zinc-800 px-6 py-3 text-white">
          Backend response: {response}
        </p>
      )}
    </div>
  );
}