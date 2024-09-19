/* eslint-disable @next/next/no-img-element */
import {
  useGetSortedChatUsersQuery,
  useLoggedInUserQuery,
} from "@/features/user/user.api";
import { IUser } from "@/interfaces/user.interface";
import { useRouter } from "next/router";

const UserList = () => {
  const { data: userData } = useLoggedInUserQuery({});
  const user: IUser = userData?.data;
  const { data } = useGetSortedChatUsersQuery(user?.id);
  const users = data?.data;
  const router = useRouter();
  const handleUserClick = (user: any) => {
    const queries = `/inbox?userId=${user?.id}&userName=${user?.name}&userEmail=${user?.email}&userImage=${user?.image}`;
    router.push(queries);
  };
  return (
    <div>
      {users?.length > 0 && (
        <h3 className="text-xl ml-4 mb-2 font-semibold">
          Recently talked to them
        </h3>
      )}

      <ul>
        {users?.map((user: any) => (
          <div key={user.id}>
            <li
              className={"p-4 cursor-pointer flex items-center gap-3"}
              onClick={() => handleUserClick(user)}
            >
              <img
                className="w-12 h-10 rounded-full"
                src={user?.image || "https://i.ibb.co/1MqspsL/user-Avater.png"}
                alt=""
              />
              <p>{user.name}</p>
            </li>
            <hr />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
