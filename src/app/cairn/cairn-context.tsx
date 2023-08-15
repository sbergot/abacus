import { Children } from "@/components/ui/types";
import {
  CairnCharacter,
  CairnGame,
  CairnMessage,
} from "@/lib/game/cairn/types";
import { createGameContext } from "@/lib/gameContext";
import { GmConnection, useGmConnection } from "@/lib/network/gmConnection";
import {
  PlayerConnection,
  usePlayerConnection,
  usePlayerConnectionStub,
} from "@/lib/network/playerConnection";
import { Logger } from "@/lib/network/types";
import { createContext, useContext } from "react";

const LoggerContext = createContext<Logger<CairnMessage> | null>(null);

export function useLoggerContext() {
  return useContext(LoggerContext)!;
}

export const {
  GameContextProvider,
  useGameContext,
  useCurrentCharacter,
  useCurrentGame,
} = createGameContext<CairnCharacter, CairnGame>("cairn");

const PlayerConnectionContext =
  createContext<PlayerConnection<CairnMessage> | null>(null);

export function PlayerConnectionStubContextProvider({ children }: Children) {
  const ctx = usePlayerConnectionStub<CairnMessage>();
  return (
    <PlayerConnectionContext.Provider value={ctx}>
      <LoggerContext.Provider value={{ log: ctx.log }}>
        {children}
      </LoggerContext.Provider>
    </PlayerConnectionContext.Provider>
  );
}

interface PlayerConnectionContextProviderProps extends Children {
  sessionCode: string;
  character: CairnCharacter;
}

export function PlayerConnectionContextProvider({
  sessionCode,
  character,
  children,
}: PlayerConnectionContextProviderProps) {
  const ctx = usePlayerConnection<CairnCharacter, CairnMessage>(
    sessionCode,
    character
  );
  return (
    <PlayerConnectionContext.Provider value={ctx}>
      <LoggerContext.Provider value={{ log: ctx.log }}>
        {children}
      </LoggerContext.Provider>
    </PlayerConnectionContext.Provider>
  );
}

export function usePlayerConnectionContext() {
  return useContext(PlayerConnectionContext)!;
}

const GmConnectionContext = createContext<GmConnection<
  CairnMessage,
  CairnGame,
  CairnCharacter
> | null>(null);

export function useGmConnectionContext() {
  return useContext(GmConnectionContext)!;
}

export function GmConnectionContextProvider({ children }: Children) {
  const ctx = useGmConnection<CairnCharacter, CairnMessage, CairnGame>(
    () => []
  );
  return (
    <GmConnectionContext.Provider value={ctx}>
      <LoggerContext.Provider value={{ log: ctx.log }}>
        {children}
      </LoggerContext.Provider>
    </GmConnectionContext.Provider>
  );
}
