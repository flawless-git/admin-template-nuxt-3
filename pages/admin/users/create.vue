<script setup lang="ts">
import { useToast } from "@/components/ui/AppToast/use-toast";
import { z } from "zod";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Role } from "@prisma/client";
import { ArrowLeft, UserPlus } from "lucide-vue-next";

definePageMeta({
  layout: "admin",
  middleware: ["check-auth"],
});

const router = useRouter();
const { toast } = useToast();

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
      .max(32, "Password maksimal 32 karakter"),
    role: z.nativeEnum(Role, {
      errorMap: () => ({ message: "Role tidak valid" }),
    }),
  })
);

const { handleSubmit } = useForm({
  validationSchema,
});

const { value: username, errorMessage: usernameError } =
  useField<string>("username");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");
const { value: role, errorMessage: roleError } = useField<Role>(
  "role",
  undefined,
  {
    initialValue: Role.USER,
  }
);

const isLoading = ref(false);

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    // Log the values being sent
    console.log("Submitting values:", {
      username: values.username.trim(),
      email: values.email.toLowerCase().trim(),
      password: values.password,
      role: values.role,
    });

    const response = await $fetch("/api/users", {
      method: "POST",
      body: {
        username: values.username.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
        role: values.role,
      },
    });

    console.log("Create response:", response);

    toast({
      title: "Success",
      description: "User berhasil dibuat",
      duration: 3000,
    });

    router.push("/admin/users");
  } catch (error: any) {
    console.error("Create error:", error);
    const message =
      error.data?.message || error.message || "Gagal membuat user";
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
        <h1 class="text-3xl font-bold">Create User</h1>
        <p class="text-muted-foreground">Add a new user to the system</p>
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
        <CardDescription>Enter the details for the new user</CardDescription>
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
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
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
            {{ isLoading ? "Creating..." : "Create User" }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
