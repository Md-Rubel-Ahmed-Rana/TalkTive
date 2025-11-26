import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const UsersLoadingSkeletonMini = ({ count = 18 }) => {
  return (
    <SidebarMenu>
      {Array.from({ length: count }).map((_, i) => (
        <SidebarMenuItem key={i} className="flex justify-center py-2">
          <Skeleton className="w-8 h-8 rounded-full" />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default UsersLoadingSkeletonMini;
