import { useGetLoggedInUserQuery } from "@/features/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IUser } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { data, isLoading } = useGetLoggedInUserQuery({});
  const user = data?.data as IUser;

  return (
    <>
      {isLoading ? (
        <div className="w-full flex items-center justify-center p-10">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto p-6">
          <Card className="shadow-lg border rounded-2xl">
            <CardHeader className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="text-xl font-semibold">
                  {user?.name?.slice(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* LEFT SECTION */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Provider</p>
                  <p className="text-sm font-medium capitalize">
                    {user?.provider}
                  </p>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="text-sm font-medium capitalize">
                    {user?.gender || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm font-medium">
                    {user?.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "Not added"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Last Login</p>
                  <p className="text-sm font-medium">
                    {user?.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Profile;
