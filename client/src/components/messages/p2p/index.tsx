import MessageContainer from "../MessageContainer";
import P2PTopBar from "./P2PTopBar";

const OneToOneMessages = () => {
  return (
    <div className="h-full w-full border flex flex-col justify-between">
      <P2PTopBar />
      <MessageContainer />
      <div>Message form</div>
    </div>
  );
};

export default OneToOneMessages;
