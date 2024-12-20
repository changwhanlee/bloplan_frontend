import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api";
import { IUser } from "../types";


export default function useUser() {
  const { isLoading, isError, data } = useQuery<IUser>({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
  });
  return { userLoading: isLoading, isLoggedIn: !isError, user: data };
}
