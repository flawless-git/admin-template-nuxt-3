import type { FetchOptions } from "ofetch";
import { useAuthStore } from "@/stores/auth";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // List of public endpoints that don't need auth
  const publicEndpoints = [
    "/api/posts",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/me",
  ];

  // List of auth endpoints that should not redirect on 401
  const authEndpoints = ["/api/auth/me", "/api/auth/logout"];

  globalThis.$fetch = $fetch.create({
    timeout: 30000,
    retry: 1,
    onRequest({ options, request }) {
      const requestUrl = request.toString();
      const isAuthEndpoint = authEndpoints.some((endpoint) =>
        requestUrl.includes(endpoint)
      );
      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        requestUrl.includes(endpoint)
      );

      if (authStore.token) {
        (options.headers as FetchOptions["headers"]) = {
          ...options.headers,
          Authorization: authStore.token,
        };
      }
    },
    onRequestError({ error }) {
      console.error("Request error:", error);
    },
    onResponseError({ response, request }) {
      const error = response._data;
      const requestUrl = request.toString();

      if (
        response.status === 401 &&
        !authEndpoints.some((endpoint) => requestUrl.includes(endpoint)) &&
        !publicEndpoints.some((endpoint) => requestUrl.includes(endpoint))
      ) {
        const router = useRouter();
        authStore.clearAuth();
        router.push("/login");
      }

      if (authEndpoints.some((endpoint) => requestUrl.includes(endpoint))) {
        return;
      }

      throw createError({
        statusCode: response.status,
        message: error?.message || "An error occurred",
      });
    },
  });
});
