import Sidebar from "@/components/messages/Sidebar";

const InboxLayoutLarge = ({ children }: any) => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-100">
      <Sidebar />
      <main className="flex-grow flex flex-col justify-center items-center h-full w-full bg-white shadow-lg">
        {children}
      </main>
    </div>
  );
};

export default InboxLayoutLarge;
