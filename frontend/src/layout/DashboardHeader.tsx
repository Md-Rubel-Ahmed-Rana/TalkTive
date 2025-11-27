import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/router";
import { useGetUserByIdQuery } from "@/features/users";
import { IUser } from "@/types/user";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const DashboardHeader = () => {
  const { query } = useRouter();
  const id = query?.id as string;
  const { open, setOpen } = useSidebar();

  const { data } = useGetUserByIdQuery({ id });
  const user = (data?.data || data) as IUser | undefined;

  const hasUser = !!user;
  const hasProfile = user?.profilePicture;

  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-gray-200 dark:bg-gray-800">
      <div className="flex items-center gap-2 px-4">
        {!hasUser ? (
          <SidebarTrigger className="-ml-1 text-gray-800 dark:text-gray-200" />
        ) : (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {hasProfile ? (
              <Image
                src={user.profilePicture as string}
                alt={user.name || "User avatar"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover border border-gray-400 dark:border-gray-600"
              />
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            <h2 className="text-md lg:text-lg font-semibold text-gray-800 dark:text-gray-200">
              {user?.name}
            </h2>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
