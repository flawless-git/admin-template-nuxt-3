<script setup lang="ts">
import { useToast } from "@/components/ui/AppToast/use-toast";
import type { User } from "@/types/data";
import { Role } from "@prisma/client";
import { z } from "zod";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { ArrowLeft } from "lucide-vue-next";

definePageMeta({
  layout: "admin",
  middleware: ["check-auth"],
});

const route = useRoute();
const router = useRouter();
const { toast } = useToast();
const isLoading = ref(false);

// Fetch current user data
const { data: user } = await useFetch<User>(`/api/users/${route.params.id}`);

if (!user.value) {
  throw createError({
    statusCode: 404,
    message: "User not found",
  });
}

// Form validation schema
const validationSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh berisi huruf, angka, dan underscore"
      ),
    email: z
      .string()
      .email("Email tidak valid")
      .max(255, "Email terlalu panjang"),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(32, "Password maksimal 32 karakter")
      .optional()
      .or(z.literal("")),
    role: z.nativeEnum(Role, {
      errorMap: () => ({ message: "Role tidak valid" }),
    }),
  })
);

const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    username: user.value.username,
    email: user.value.email,
    password: "",
    role: user.value.role,
  },
});

// Add after validation schema
const { value: username, errorMessage: usernameError } =
  useField<string>("username");

const { value: email, errorMessage: emailError } = useField<string>("email");

const { value: password, errorMessage: passwordError } =
  useField<string>("password");

const { value: role, errorMessage: roleError } = useField<Role>("role");

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    await $fetch(`/api/users/${route.params.id}`, {
      method: "PUT",
      body: {
        username: values.username.trim(),
        email: values.email.toLowerCase().trim(),
        role: values.role,
        ...(values.password ? { password: values.password } : {}),
      },
    });

    toast({
      title: "Success",
      description: "User berhasil diupdate",
      duration: 3000,
    });
    router.push("/admin/users");
  } catch (error: any) {
    const message =
      error.data?.message || error.message || "Gagal mengupdate user";
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
      duration: 3000,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Edit User</h1>
        <p class="text-muted-foreground">Update user information</p>
      </div>
      <NuxtLink to="/admin/users">
        <Button variant="outline">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Users
        </Button>
      </NuxtLink>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Update the user's details</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="username">Username</Label>
            <Input id="username" v-model="username" placeholder="johndoe" />
            <span v-if="usernameError" class="text-sm text-destructive">
              {{ usernameError }}
            </span>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="john@example.com"
            />
            <span v-if="emailError" class="text-sm text-destructive">
              {{ emailError }}
            </span>
          </div>

          <div class="space-y-2">
            <Label for="password">Password (Optional)</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Leave blank to keep current password"
            />
            <span v-if="passwordError" class="text-sm text-destructive">
              {{ passwordError }}
            </span>
          </div>

          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Select v-model="role">
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="Role.USER">User</SelectItem>
                <SelectItem :value="Role.ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <span v-if="roleError" class="text-sm text-destructive">
              {{ roleError }}
            </span>
          </div>

          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? "Updating..." : "Update User" }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
