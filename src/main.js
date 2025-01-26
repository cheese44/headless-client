import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createRouter, createWebHistory } from 'vue-router';
import Blog from './components/Blog.vue';
import Post from './components/Post.vue';

const routes = [
    { path: '/', component: Blog },
    { path: '/post/:id', component: Post },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

createApp(App)
    .use(router)
    .mount('#app')