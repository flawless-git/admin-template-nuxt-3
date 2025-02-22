<script setup lang="ts">
import { AppToaster } from "@/components/ui/AppToast";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { watch } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Watch auth status using computed
watch(
  () => authStore.isAuthenticated,
  (newValue) => {
    if (!newValue && route.path.startsWith("/admin")) {
      router.push("/login");
    } else if (newValue && route.path === "/login") {
      router.push("/admin");
    }
  }
);
</script>

<template>
  <div class="flex min-h-screen bg-background">
    <div class="flex-1 flex flex-col">
      <AppHeader />
      <main class="flex-1 px-4 py-8">
        <slot />
      </main>
      <AppFooter class="mt-auto border-t" />
    </div>
    <AppToaster />
  </div>
</template>

<style></style>
