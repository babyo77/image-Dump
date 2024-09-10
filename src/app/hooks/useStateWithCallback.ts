import { IUser } from "@/lib/models/userModel";
import { useCallback, useEffect, useRef, useState } from "react";

type Callback = (state: IUser[]) => void;

export default function useStateWithCallback(initialState: IUser[]) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<Callback | null>(null);

  const updateState = useCallback(
    (newState: IUser[] | ((prevState: IUser[]) => IUser[]), cb?: Callback) => {
      cbRef.current = cb || null;
      setState((prev) =>
        typeof newState === "function" ? newState(prev) : newState
      );
    },
    []
  );

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState] as const;
}
