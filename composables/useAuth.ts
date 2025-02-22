import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/components/ui/AppToast/use-toast";
import type { LoginPayload } from "@/types/data";

export const useAuth = () => {
  const store = useAuthStore();
  const router = useRouter();
  const toast = useToast();

  const login = async (payload: LoginPayload): Promise<boolean> => {
    try {
      return await store.login(payload);
    } catch (error: any) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return false;
    }
  };

  const logout = async () => {
    await store.logout();
    await router.push("/login");
  };

  return {
    user: computed(() => store.user),
    token: computed(() => store.token),
    isAuthenticated: computed(() => store.isAuthenticated),
    isAdmin: computed(() => store.isAdmin),
    login,
    logout,
    checkAuth: store.checkAuth,
  };
};
