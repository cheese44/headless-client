<script setup>
  const { headline, posts } = defineProps(['headline', 'posts'])
</script>

<template>
  <h2 v-if="posts.length > 0" class="my-4">{{ headline }}</h2>
    <div v-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-2">
      <div v-for="post in posts" :key="post.id" class="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ post.title.rendered }}</h2>
        <div class="text-sm text-gray-600 mb-4">
          <p>Published on: {{ new Date(post.date).toLocaleDateString() }}</p>
        </div>
        <div v-html="post.excerpt.rendered" class="text-gray-700 mb-4"></div>
        <RouterLink :to="`/post/${post.id}`" class="text-blue-500 hover:underline">Read more...</RouterLink>
      </div>
    </div>
</template>
