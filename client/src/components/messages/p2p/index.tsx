import MessageForm from "../common/MessageForm";
import P2PMessageContainer from "./P2PMessageContainer";
import P2PTopBar from "./P2PTopBar";

const OneToOneMessages = () => {
  return (
    <div className="h-screen lg:h-full w-full border flex flex-col justify-between">
      <P2PTopBar />
      <P2PMessageContainer />
      <MessageForm />
    </div>
  );
};

export default OneToOneMessages;
