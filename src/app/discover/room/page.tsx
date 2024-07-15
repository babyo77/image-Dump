"use client";
import useWebRTC from "@/app/hooks/useWebRTC";
import { useState } from "react";

function Room() {
  const { clients } = useWebRTC();
  return (
    <div>
      {clients.map((client) => (
        <div key={client.id}>
          <audio src="" controls autoPlay></audio>
          <h1>{client.name}</h1>
        </div>
      ))}
    </div>
  );
}

export default Room;
