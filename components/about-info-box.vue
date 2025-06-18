<template>
  <div
    ref="targetRef"
    :style="{ backgroundImage: `url(${background})` }"
    class="relative h-[85dvh] tablet:h-[21.5rem] w-full flex flex-col items-center justify-center gap-4 bg-no-repeat bg-cover bg-center p-6 rounded-2xl"
  >
    <div
      class="absolute inset-0 isolate w-full flex flex-col-reverse tablet:flex-row items-center justify-start gap-16 bg-zinc-700/50 rounded-2xl"
    >
      <figure
        class="inline-block h-full w-full max-tablet:h-[55%] tablet:w-[25%]"
      >
        <Transition name="fade-start" mode="out-in">
          <nuxt-img
            v-if="isInView"
            :src="personImage"
            alt="about-us-image"
            class="max-w-[260px] max-h-[512px] max-tablet:max-h-[52%] absolute rtl:right-0 bottom-0 inline-block drop-shadow-2xl"
          />
        </Transition>
      </figure>
      <Transition name="fade-down" mode="out-in">
        <p
          v-if="isInView"
          class="w-full max-tablet:h-[45%] tablet:w-[70%] text-center text-gray-100 tablet:py-10 tablet:pe-10 p-8 text-base tablet:text-xl font-semibold"
        >
          {{ description }}
        </p>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
const targetRef = ref<HTMLElement | null>(null);
const { isInView } = useInView(targetRef, {
  rootMargin: "-160px",
});

defineProps<{
  description: string;
  personImage: string;
  background: string;
}>();
</script>
<style>
.fade-start-enter-active,
.fade-start-leave-active {
  transition: all 0.5s;
  will-change: opacity, transform;
}
.fade-start-enter-from,
.fade-start-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
