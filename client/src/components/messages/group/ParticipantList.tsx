import { IGetUser } from "@/interfaces/user.interface";

type Props = {
  participants: IGetUser[];
};

const ParticipantList = ({ participants }: Props) => {
  const participantsName = participants?.map((p) => p?.name);
  return (
    <div className="hidden lg:block">
      <p className="text-sm">{participantsName?.slice(0, 3)?.join(", ")}</p>
    </div>
  );
};

export default ParticipantList;
