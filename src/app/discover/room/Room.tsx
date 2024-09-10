"use client";
import useWebRTC from "@/app/hooks/useWebRTC";
import { IUser } from "@/lib/models/userModel";

function Room({ user }: { user: IUser }) {
  const { clients, provideRef } = useWebRTC("roomId", user);
  return (
    <div>
      {clients.map((client) => (
        <div key={client._id}>
          <audio
            ref={(instance) => provideRef(instance, client._id)}
            controls
            autoPlay
          ></audio>
          <h1>{client.name}</h1>
        </div>
      ))}
    </div>
  );
}

export default Room;
