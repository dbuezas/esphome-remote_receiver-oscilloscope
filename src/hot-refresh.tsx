import React, { useEffect, useState } from "react";

const HotRefresh: React.FC = ({ children }) => {
  const [error, setError] = useState("");
  if (process.env.NODE_ENV !== "production") {
    useEffect(() => {
      const socket = new WebSocket("ws://localhost:8081");
      socket.addEventListener("connection", (event) => {
        console.log("connected ", event);
      });
      socket.addEventListener("message", async (event) => {
        console.log("Message from server ", event);
        const { action, payload } = JSON.parse(event.data);
        if (action === "update-app") window.location.reload();
        if (action === "error") setError(payload);
      });
      return () => socket.close();
    }, []);
  }
  return error ? <>{error}</> : <>{children}</>;
};
export default HotRefresh;
