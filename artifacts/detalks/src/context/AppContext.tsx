import { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError, type ApiUser } from "@/lib/api";

type AppState = {
  user: ApiUser | null;
  authLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppState>({
  user: null,
  authLoading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const { user } = await api.me();
        return user;
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null;
        throw err;
      }
    },
    staleTime: 60_000,
    retry: false,
  });

  const refreshUser = async () => {
    await refetch();
  };

  const logout = async () => {
    await api.logout();
    sessionStorage.removeItem("detalks-consent");
    sessionStorage.removeItem("detalks-consent-v2");
    queryClient.clear();
    await refetch();
  };

  return (
    <AppContext.Provider
      value={{ user: data ?? null, authLoading: isLoading, refreshUser, logout }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
