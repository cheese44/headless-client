<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import {RouterView} from 'vue-router'
</script>

<template>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/dist/styles.css" rel="stylesheet">
  </head>
  <body class="bg-gray-50 text-gray-900">
    <Header/>
    <main class="py-12 px-4">
      <RouterView/>
    </main>
    <Footer/>
  </body>

</template>