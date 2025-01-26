<script setup>
import PostCards from './PostCards.vue'
</script>

<template>
  <div class="w-full mx-auto my-8 px-4">

    <div v-if="loading" class="text-center">
      <p>Loading posts...</p>
    </div>

    <div v-if="error" class="text-center text-red-500">
      <p>There was an error loading the posts. Please try again later.</p>
    </div>

    <PostCards :posts/>

    <div v-if="!loading && posts.length === 0" class="text-center text-gray-500">
      <p>No posts found.</p>
    </div>
  </div>
</template>

<script>
import {useRoute} from "vue-router";

export default {
  data() {
    return {
      posts: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_SERVER_DOMAIN + '/wp-json/wp/v2/posts' + (useRoute().query.category ? '?categories=' + useRoute().query.category : ''));
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.posts = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Optional custom styles */
</style>
