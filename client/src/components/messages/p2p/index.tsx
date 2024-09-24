import MessageForm from "../common/MessageForm";
import MessageContainer from "../MessageContainer";
import P2PTopBar from "./P2PTopBar";

const OneToOneMessages = () => {
  return (
    <div className="h-screen lg:h-full w-full border flex flex-col justify-between">
      <P2PTopBar />
      <MessageContainer />
      <MessageForm />
    </div>
  );
};

export default OneToOneMessages;
