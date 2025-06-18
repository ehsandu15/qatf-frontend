<template>
  <section class="relative overflow-hidden">
    <sections-hero />
    <sections-why-choose-us />
    <lazy-sections-about-us />
    <lazy-sections-factors-of-success />
    <lazy-sections-posters />
    <lazy-sections-our-vision />
    <lazy-sections-our-goals />
    <lazy-sections-features />
    <lazy-sections-products />
    <lazy-sections-gallery />
    <lazy-sections-our-clients />
    <lazy-sections-newsletter />
    <button
      class="fixed bottom-12 right-8 size-12 flex items-center justify-center z-10 bg-secondary text-white rounded-full transition-all duration-300"
      :class="
        scrollY > 100 ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
      "
      @click="scrollToTop"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-arrow-up-icon lucide-arrow-up"
      >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
    </button>
  </section>
</template>
<script setup lang="ts">
const { scrollY } = useScroll();

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>
