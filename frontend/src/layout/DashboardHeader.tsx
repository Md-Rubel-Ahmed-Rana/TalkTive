import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { sidebarBreadcrumbs } from "./SidebarBreadcrumbs";

const DashboardHeader = () => {
  const pathname = usePathname();

  const crumbs = sidebarBreadcrumbs[pathname] || [];

  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-gray-200 dark:bg-gray-800">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1  text-gray-800 dark:text-gray-200" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((label, index) => (
              <BreadcrumbItem
                key={index}
                className="flex text-gray-800 dark:text-gray-200"
              >
                {index === crumbs.length - 1 ? (
                  <BreadcrumbPage className="text-gray-800 dark:text-gray-200">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={pathname}>{label}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default DashboardHeader;
