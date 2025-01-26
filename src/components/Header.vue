<template>
  <header class="bg-indigo-600 text-white">
    <div class="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
      <a href="/" class="text-2xl font-bold">MyWebsite</a>

      <div v-if="loading" class="text-center">
        <p>Loading categories...</p>
      </div>

      <div v-if="error" class="text-center text-red-500">
        <p>There was an error loading the categories. Please try again later.</p>
      </div>

      <div v-if="categories.length > 0">
        <nav class="space-x-6">
          <a v-for="category in categories" :key="category.id" :href="`/?category=${category.id}`" class="hover:text-indigo-200 px-2">{{ category.name }}</a>
        </nav>
      </div>
      <button class="md:hidden text-white focus:outline-none" id="menu-toggle">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
  </header>
</template>
<script>
import {useRoute} from "vue-router";

export default {
  data() {
    return {
      categories: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_SERVER_DOMAIN + '/wp-json/wp/v2/categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.categories = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>