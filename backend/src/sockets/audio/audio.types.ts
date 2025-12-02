export type UserPayload = {
  id: string | number;
  name?: string;
};

export type AudioChunkPayload = {
  room: string;
  userId: string | number;
  chunk: ArrayBuffer | Uint8Array; // raw PCM/Opus chunk from client
  sequence?: number; // optional for reassembly
  timestamp?: number;
};

export type CallSession = {
  id: string;
  room: string;
  participants: Array<{ id: string | number; joinedAt: number }>;
  startedAt: number;
  endedAt?: number;
  metadata?: Record<string, any>;
};
