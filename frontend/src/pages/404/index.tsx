import NotFoundError from "@/common/404";
import PageMetadata from "@/common/PageMetadata";

const NotFoundErrorPage = () => {
  return (
    <>
      <PageMetadata
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        keywords="404, not found, error page"
      />
      <NotFoundError />
    </>
  );
};

export default NotFoundErrorPage;
