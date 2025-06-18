<template>
  <section
    ref="elementRef"
    class="relative flex flex-col items-center justify-center bg-cover bg-center bg-fixed text-white py-16 md:py-40 min-h-dvh transition-transform duration-[1500ms] ease-in-out overflow-hidden"
    :class="isInView ? 'scale-100 translate-y-0' : 'scale-105 translate-y-6'"
    :style="{ 'background-image': `url(${heroImage})` }"
  >
    <div class="absolute inset-0 bg-black/60" />
    <div
      class="app-container relative z-10 text-center flex flex-col items-center"
    >
      <TransitionGroup name="fade-down" mode="out-in">
        <span
          v-if="isInView"
          style="transition-delay: 100ms"
          class="tablet:max-w-[70%] tablet:ltr:max-w-[85%] mb-8 flex items-center justify-center gap-4 flex-wrap"
        >
          <component
            :is="elem"
            v-for="(elem, idx) of headingTitleElem"
            :key="idx"
          />
        </span>

        <p
          v-if="isInView"
          style="transition-delay: 300ms"
          class="max-w-2xl delay-150 mx-auto mb-8 ltr:text-base text-lg text-white/70"
        >
          {{ hero.home?.heroDescription }}
        </p>
      </TransitionGroup>
      <Transition name="fade-up" mode="out-in">
        <NuxtLink
          v-if="isInView"
          style="transition-delay: 400ms"
          class="bg-white delay-200 text-primary font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          :href="pathWithLocale(hero.home?.heroCtaHref)"
        >
          {{ hero.home?.heroCtaTitle }}
        </NuxtLink>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import type { VNodeRef } from "vue";
import { QUERY_KEYS } from "~/constants/query-keys";
const img = useImage();
const elementRef = ref<VNodeRef | null>(null);
const { isInView } = useInView(elementRef);
const { $directus } = useNuxtApp();
const { currentLocale, getLocaleObject, pathWithLocale } = useI18n();
const { data: heroData } = await useAsyncData(QUERY_KEYS.pages.home.hero, () =>
  $directus.query(`
    query {
      home {
        heroBackground
        heroHeadingImage
        translations {
          id
          languages_id
          heroHeading
          heroDescription
          heroCtaHref
          heroCtaTitle
        }
        
      }
    }
`)
);

const hero = computed(() => {
  return {
    home: {
      ...heroData.value.home,
      ...heroData.value.home.translations.find(
        (t) =>
          t.languages_id.toString() === getLocaleObject(currentLocale.value).id
      ),
    },
  };
});
const heroImage = img(hero.value.home?.heroBackground, undefined, {
  provider: "directus",
});

const headingImg = img(hero.value.home?.heroHeadingImage, undefined, {
  provider: "directus",
});

const headingTitleElem = computed(() =>
  hero.value?.home?.heroHeading?.split(" ").map((part) =>
    part === "{image}"
      ? h(
          "span",
          {
            class:
              "inline-block p-1 w-48 rounded-full bg-white/50 backdrop-blur-sm ",
          },
          h("img", {
            src: headingImg,
            class: "w-full h-16 object-cover rounded-full",
          })
        )
      : h(
          "p",
          {
            class:
              "md:text-5xl text-[40px] leading-10 md:ltr:text-[44px]/6 font-bold",
          },
          part
        )
  )
);
</script>
<style>
.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 1s;
  will-change: opacity, transform;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 1s;
  will-change: opacity, transform;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
