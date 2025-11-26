import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, UserCog, UserPlus2, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNavItems = () => {
  const pathname = usePathname();

  const navMain = [
    {
      title: "Manage admins",
      icon: UserCog,
      isActive: false,
      items: [
        {
          title: "All admins",
          url: `/admins`,
          icon: Users,
        },
        {
          title: "Create admin",
          url: `/admins/create`,
          icon: UserPlus2,
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navMain.map((item) => {
          const isSectionActive = item.items?.some((subItem) =>
            pathname?.startsWith(subItem.url)
          );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isSectionActive}
              className="group/collapsible mb-3"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isActive = pathname === subItem.url;

                      return (
                        <SidebarMenuSubItem
                          className="mb-2"
                          key={subItem.title}
                        >
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.url}
                              className={
                                isActive ? "text-primary font-medium" : ""
                              }
                            >
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SideNavItems;
