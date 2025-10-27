import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth/api";
import { isAuthenticated } from "@/lib/token";

interface CurrentUser {
  userId: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  role: "USER" | "ADMIN";
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<CurrentUser | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!isAuthenticated()) {
        return null;
      }
      try {
        return await authApi.getCurrentUser();
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    retry: false,
  });

  const invalidateUser = () => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "ADMIN";

  return {
    user,
    isLoggedIn,
    isAdmin,
    isLoading,
    invalidateUser,
  };
};
