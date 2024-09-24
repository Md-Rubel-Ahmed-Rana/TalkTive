import { description } from "@/components/common/Welcome";
import CreateNewGroup from "@/components/create-new-group";
import RootLayout from "@/layout";
import GetHead from "@/utils/Head";
import { ReactElement } from "react";

const CreateGroupPage = () => {
  return (
    <>
      <GetHead
        title="Create Group - TalkTive"
        description={description}
        keywords="talktive, message, audio, video"
      />
      <CreateNewGroup />
    </>
  );
};

export default CreateGroupPage;

CreateGroupPage.getLayout = function (page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
