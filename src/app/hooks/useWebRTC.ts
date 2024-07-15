import { useState } from "react";

function useWebRTC() {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "tanmay",
    },
    {
      id: 2,
      name: "zara",
    },
  ]);
  return { clients };
}

export default useWebRTC;
