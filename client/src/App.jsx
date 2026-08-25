import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Checking backend...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/health");

        setMessage(response.data.message);
      } catch (error) {
        console.error("Backend connection failed:", error);
        setMessage("Backend connection failed");
      }
    };

    checkBackend();
  }, []);

  return (
    <div>
      <h1>Placement Management & Career Portal</h1>

      <p>Backend Status:</p>

      <strong>{message}</strong>
    </div>
  );
}

export default App;