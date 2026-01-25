export type WebRtcSignal = {
  room: string;
  from: string | number;
  to?: string | number;
  sdp?: any;
  candidate?: any;
  metadata?: any;
};

export type VideoSession = {
  id: string;
  room: string;
  startedAt: number;
  participants: Array<{ id: string | number; joinedAt: number }>;
  endedAt?: number;
  metadata?: Record<string, any>;
};
