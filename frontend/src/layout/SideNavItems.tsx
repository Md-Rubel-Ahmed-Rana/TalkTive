import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useGetAllUsersQuery } from "@/features/users";
import { IUser } from "@/types/user";
import UsersLoadingSkeleton from "@/skeletons/UsersLoadingSkeleton";
import UsersLoadingSkeletonMini from "@/skeletons/UsersLoadingSkeletonMini";

const SideNavItems = () => {
  const { data, isLoading } = useGetAllUsersQuery({});
  const [search, setSearch] = useState("");
  const { open } = useSidebar();

  const users = (data?.data || data || []) as IUser[];

  const filteredUsers = users.filter((user) =>
    (user?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!isLoading) {
    return open ? <UsersLoadingSkeleton /> : <UsersLoadingSkeletonMini />;
  }

  return (
    <SidebarGroup className="space-y-3">
      {open && (
        <Input
          placeholder="Search to chat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 text-sm ring-2 ring-gray-300 dark:ring-gray-700"
        />
      )}

      <SidebarMenu>
        {filteredUsers.map((user) => {
          const avatar = (
            <Avatar className="w-8 h-8 ring-1 ring-gray-300 dark:ring-gray-700">
              {user.profilePicture ? (
                <AvatarImage
                  src={user.profilePicture}
                  alt={user.name || "User Image"}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  {user.name?.charAt(0).toUpperCase() || "N"}
                </AvatarFallback>
              )}
            </Avatar>
          );

          return (
            <SidebarMenuItem
              key={user._id}
              className={
                open
                  ? "py-3 flex items-center border border-gray-300 dark:border-gray-700 gap-2 hover:bg-white dark:hover:bg-gray-700 rounded-md px-2 cursor-pointer transition"
                  : "flex justify-center py-2"
              }
            >
              {/* 👇 Make avatar OR full item clickable based on sidebar state */}
              <Link
                href={`/chat/${user._id}`}
                className={open ? "flex items-center gap-2 w-full" : ""}
              >
                {avatar}
                {open && <span className="truncate">{user.name}</span>}
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SideNavItems;
