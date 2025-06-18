<template>
  <div
    class="app-container min-h-screen flex flex-col justify-start items-start gap-2 mt-16 pb-8"
  >
    <span class="w-full flex flex-col gap-3">
      <p
        class="relative w-fit self-center text-secondary max-md:text-base text-xs font-bold mb-1 before:absolute before:bottom-0 before:left-0 before:w-full before:rounded-full before:h-1/2 before:bg-gradient-to-t px-2 py-1 before:from-secondary/60 isolate"
      >
        {{ factorsOfSuccess?.factorsOfSuccessTitle }}
      </p>
      <h3
        ref="targetRef"
        class="text-black font-bold text-[32px] lg:text-[44px] text-center ltr:leading-tight"
      >
        {{ factorsOfSuccess?.factorsOfSuccessDescription }}
      </h3>
    </span>
    <TransitionGroup
      name="fade-up"
      tag="ul"
      class="mt-8 [&>:nth-child(even)]:!delay-300 [&>:nth-child(odd)]:!delay-100 grid grid-cols-2 md:grid-cols-3 gap-6 md:[&>:nth-child(odd)]:flex-col-reverse"
    >
      <li
        v-for="(item, index) in factorsOfSuccess.aboutItems"
        v-show="isInView"
        :key="index"
        class="flex flex-col max-md:flex-col-reverse gap-4 md:gap-2 max-md:order-1 max-md:col-span-2 max-md:h-fit max-md:max-h-96"
      >
        <span
          class="w-full flex items-center gap-2 flex-col justify-center h-fit md:h-[33%]"
        >
          <NuxtImg
            :src="item.icon"
            :alt="item.title"
            class="w-8 h-8 bg-primary/10"
          />
          <h4 class="font-bold text-[20px] md:text-2xl text-black">
            {{ item.title }}
          </h4>
          <p class="text-base font-medium text-black/50 text-center">
            {{ item.description }}
          </p>
        </span>
        <span
          class="rounded-[20px] flex items-center justify-center h-1/3 md:h-[66%] overflow-hidden relative"
        >
          <span class="absolute inset-0 bg-gradient-to-t from-slate-800/50" />
          <NuxtImg
            :src="item.background"
            :alt="item.title"
            class="object-cover h-full w-full"
          />
        </span>
      </li>
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";

const targetRef = ref<HTMLElement | null>(null);
const { isInView } = useInView(targetRef, {
  rootMargin: "360px",
});
const img = useImage();
const { $directus } = useNuxtApp();
const { currentLocale, getLocaleObject } = useI18n();
const { data: factorsOfSuccessData } = await useAsyncData(
  QUERY_KEYS.pages.home.factorsOfSuccess,
  () =>
    $directus.query(`
  query {
    home {
      aboutItems {
        id
        background
        icon
        translations {
          id
          languages_id
          title
          description
        }
      }
      translations {
        id
        languages_id
        factorsOfSuccessTitle
        factorsOfSuccessDescription
      }
    }
  }
`)
);

const factorsOfSuccess = computed(() => {
  return {
    ...factorsOfSuccessData.value?.home,
    ...factorsOfSuccessData.value?.home?.translations.find(
      (t: {
        languages_id: number;
        aboutHeadingTitle: string;
        aboutHeadingDescription: string;
      }) =>
        t.languages_id.toString() === getLocaleObject(currentLocale.value).id
    ),
    aboutItems: factorsOfSuccessData.value?.home?.aboutItems.map(
      (item: {
        icon: string;
        background: string;
        translations: {
          languages_id: number;
          title: string;
          description: string;
        }[];
      }) => ({
        ...item,
        icon: img(item.icon, undefined, {
          provider: "directus",
        }),
        background: img(item.background, undefined, {
          provider: "directus",
        }),
        ...item.translations.find(
          (t: { languages_id: number; title: string; description: string }) =>
            t.languages_id.toString() ===
            getLocaleObject(currentLocale.value).id
        ),
      })
    ),
  };
});
</script>
