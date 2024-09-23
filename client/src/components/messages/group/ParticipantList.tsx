import { IGetUser } from "@/interfaces/user.interface";

type Props = {
  participants: IGetUser[];
};

const ParticipantList = ({ participants }: Props) => {
  const participantsName = participants?.map((p) => p?.name);
  return <div>{participantsName?.join(", ")}</div>;
};

export default ParticipantList;
