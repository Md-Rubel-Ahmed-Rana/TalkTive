import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavUser from "./NavUser";
import SystemInfo from "./SystemInfo";
import SideNavItems from "./SideNavItems";

const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-gray-200 dark:bg-gray-800">
        <SystemInfo />
      </SidebarHeader>
      <SidebarContent className="bg-gray-200 dark:bg-gray-800">
        <SideNavItems />
      </SidebarContent>
      <SidebarFooter className="bg-gray-200 dark:bg-gray-800">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
