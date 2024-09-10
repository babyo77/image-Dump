import { useCallback, useEffect, useRef } from "react";
import useStateWithCallback from "./useStateWithCallback";
import { IUser } from "@/lib/models/userModel";
import { toast } from "sonner";

type AudioElements = {
  [userId: string]: HTMLAudioElement | null;
};

type Connections = {
  [userId: number]: RTCPeerConnection | null;
};

function useWebRTC(roomId: string, user: IUser) {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef<AudioElements>({});
  const connections = useRef<Connections>({});
  const localMediaStream = useRef<MediaStream | null>(null);
  const clientsRef = useRef<IUser[]>([]);

  const provideRef = useCallback(
    (instance: HTMLAudioElement | null, userId: string) => {
      audioElements.current[userId] = instance;
    },
    []
  );

  const addNewClients = useCallback(
    (newClient: IUser, cb: () => void) => {
      const found = clientsRef.current.find(
        (client) => client._id === newClient._id
      );
      if (!found) {
        clientsRef.current = [...clientsRef.current, newClient];
        setClients(clientsRef.current, cb);
      }
    },
    [setClients]
  );

  useEffect(() => {
    const startCapture = async () => {
      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        if (user) {
          addNewClients(user, () => {
            const localElement = audioElements.current[user._id];
            if (localElement && localMediaStream.current) {
              localElement.volume = 0;
              localElement.srcObject = localMediaStream.current;
            }
          });
        }
      } catch (error: any) {
        toast.error(`Error capturing audio stream: ${error?.message}`);
      }
    };

    startCapture();
  }, [user, addNewClients]);

  return { clients, provideRef };
}

export default useWebRTC;
