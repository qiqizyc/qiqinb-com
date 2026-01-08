<template>
  <div class="background"></div>
    <Home />
  <footer>
    <span>© 2025 Made By <a href="/" target="_blank">{{ userName }}</a> | 本站由<a target="_blank" href="https://cloud.baidu.com/product/cdn.html">百度云CDN</a>
      、<a target="_blank" href="https://www.aliyun.com/product/cdn">阿里云CDN</a>提供加速 | </span>
    <a v-if="icpNumber" href="https://beian.miit.gov.cn/" target="_blank">{{ icpNumber }}</a>
    <a v-if="policenumber" :href="`https://beian.mps.gov.cn/#/query/webSearch?police=${policenumber}`" target="_blank" class="police_link">
      <span class="police_img"></span> {{ policenumber }}
    </a>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import Home from './components/Home.vue';

const userName = ref(import.meta.env.VITE_APP_USER_NAME);
const icpNumber = ref(import.meta.env.VITE_APP_ICP_NUMBER);
const policenumber = ref(import.meta.env.VITE_APP_POLICE_NUMBER);
</script>