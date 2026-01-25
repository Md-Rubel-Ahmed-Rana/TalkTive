import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const UsersLoadingSkeleton = ({ count = 18 }) => {
  return (
    <SidebarMenu className="p-2">
      {Array.from({ length: count }).map((_, i) => (
        <SidebarMenuItem
          key={i}
          className="py-3 flex items-center border border-gray-300 dark:border-gray-700 gap-2 rounded-md px-2"
        >
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default UsersLoadingSkeleton;
