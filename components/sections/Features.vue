<template>
  <div class="app-container flex flex-col gap-5 mt-10">
    <figure ref="targetRef" class="w-full h-96 rounded-[20px] overflow-hidden">
      <NuxtImg
        provider="directus"
        :src="features?.servicesHeroImage"
        alt="01.webp"
        class="!w-full max-md:!h-full object-cover rounded-[20px]"
      />
    </figure>
    <template v-if="features?.servicesList">
      <TransitionGroup
        tag="ul"
        name="scale-enter"
        class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[180px]"
      >
        <li
          v-for="(stat, idx) of features?.servicesList"
          v-show="isInView"
          :key="idx"
          class="flex flex-col gap-1.5 shadow-2xl p-5 rounded-[24px]"
          :style="{
            order: stat.isActive ? 1 : idx + 1,
          }"
          :class="[stat.isActive ? 'bg-primary' : `bg-white`]"
        >
          <h3
            class="text-[40px] tablet:text-5xl font-extrabold text-start"
            :class="stat.isActive ? 'text-white' : 'text-black'"
          >
            {{ stat.title }}
          </h3>
          <p
            class="text-base tablet:text-xl font-bold"
            :class="stat.isActive ? 'text-white' : 'text-black'"
          >
            {{ stat.description }}
          </p>
        </li>
      </TransitionGroup>
    </template>
  </div>
</template>
<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";

const targetRef = ref<HTMLElement | null>(null);
const { isInView } = useInView(targetRef, {
  threshold: 0.4,
});
const { $directus } = useNuxtApp();
const { currentLocale, getLocaleObject } = useI18n();
const { data: featuresData } = await useAsyncData(
  QUERY_KEYS.pages.home.features,
  () =>
    $directus.query(`
  query {
   home {
    servicesHeroImage
    servicesList {
      id
      isActive
      translations {
        id
        languages_id
        title
        description
      }
    }
   }
  }
`)
);

const features = computed(() => {
  return {
    ...featuresData.value?.home,
    servicesList: featuresData.value?.home?.servicesList.map(
      (service: {
        translations: {
          languages_id: number;
          title: string;
          description: string;
        }[];
      }) => {
        return {
          ...service,
          ...service.translations.find(
            (t: { languages_id: number; title: string; description: string }) =>
              t.languages_id.toString() ===
              getLocaleObject(currentLocale.value).id
          ),
        };
      }
    ),
  };
});
</script>
