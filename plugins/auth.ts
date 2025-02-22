import { useAuthStore } from "@/stores/auth";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Check auth on app init
  if (process.client && authStore.token && !authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // Add navigation guard
  const router = useRouter();
  router.beforeEach(async (to) => {
    if (to.path.startsWith("/admin") && !authStore.isAuthenticated) {
      if (authStore.token) {
        const success = await authStore.checkAuth();
        if (!success) {
          return "/login";
        }
      } else {
        return "/login";
      }
    }
  });
});
