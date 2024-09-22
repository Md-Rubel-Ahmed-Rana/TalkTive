import { IGetMedia } from "@/interfaces/message.interface";
import Image from "next/image";

type Props = {
  image: IGetMedia;
};

const MessageImage = ({ image }: Props) => {
  return (
    <Image
      src={image?.url}
      alt={"message image"}
      width={100}
      height={100}
      className="w-28 h-28 rounded-md cursor-pointer border-2"
    />
  );
};

export default MessageImage;
