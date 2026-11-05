import { useEffect } from "react";
import { api } from "../api/api";

export default function Home() {
  useEffect(() => {
    async function pingBackend() {
      try {
        const response = await api.call<string>("ping");
        console.log("Backend response:", response);
      } catch (error) {
        console.error("Backend ping failed:", error);
      }
    }

    void pingBackend();
  }, []);

  return <>Hello</>;
}