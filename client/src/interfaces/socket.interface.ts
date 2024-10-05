export type ISocketEvent = {
  sender: EventSender;
  receiver: string;
};

export type EventSender = {
  id: string;
  name: string;
  image: string;
};
