<script setup lang="ts">
import { useToast } from "@/components/ui/AppToast/use-toast";
import { Pencil, Trash2, Plus, MoreHorizontal } from "lucide-vue-next";
import type { Post } from "@/types/data";

definePageMeta({
  layout: "admin",
  middleware: ["check-auth"],
});

const router = useRouter();
const { toast } = useToast();
const isLoading = ref(false);

// Update ref with type
const posts = ref<Post[]>([]);

// Fetch posts
const fetchPosts = async () => {
  try {
    isLoading.value = true;
    const data = await $fetch("/api/posts");
    posts.value = data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "Failed to fetch posts",
      duration: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

// Delete post
const handleDelete = async (id: number) => {
  try {
    await $fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });
    toast({
      title: "Success",
      description: "Post berhasil dihapus",
      duration: 3000,
    });
    await fetchPosts();
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "Failed to delete post",
      duration: 3000,
    });
  }
};

// Edit post
const handleEdit = (id: number) => {
  router.push(`/admin/posts/${id}/edit`);
};

onMounted(fetchPosts);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Posts</h1>
        <p class="text-muted-foreground">Manage blog posts</p>
      </div>
      <NuxtLink to="/admin/posts/create">
        <Button>
          <Plus class="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </NuxtLink>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>All Posts</CardTitle>
        <CardDescription>List of all blog posts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead class="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="post in posts" :key="post.id">
              <TableCell>{{ post.title }}</TableCell>
              <TableCell>{{ post.author.username }}</TableCell>
              <TableCell>
                <Badge :variant="post.published ? 'default' : 'secondary'">
                  {{ post.published ? "Published" : "Draft" }}
                </Badge>
              </TableCell>
              <TableCell>{{
                new Date(post.createdAt).toLocaleDateString()
              }}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as="Button" variant="ghost" size="icon">
                    <MoreHorizontal class="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem @click="handleEdit(post.id)">
                      <Pencil class="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      @click="handleDelete(post.id)"
                      class="text-destructive focus:text-destructive"
                    >
                      <Trash2 class="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
