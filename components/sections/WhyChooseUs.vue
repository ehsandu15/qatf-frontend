<template>
  <section class="w-full bg-zinc-100 py-10 isolate">
    <div
      class="w-full h-fit flex flex-col items-center justify-start container app-container gap-1.5"
    >
      <span class="flex flex-col items-center justify-center gap-2">
        <h3 class="text-3xl md:text-4xl text-center font-bold">
          {{ whyChooseUsMapped.headingTitle }}
        </h3>
        <p class="text-center text-sm md:text-base text-black/70">
          {{ whyChooseUsMapped.description }}
        </p>
      </span>

      <transition-group
        name="fade-up"
        tag="ul"
        class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-8 md:gap-4 mt-14 tablet:mt-4 [&>:nth-child(even)>:nth-child(1)]:!bg-secondary/20 tablet:[&>:nth-child(odd)]:!mt-28"
      >
        <li
          v-for="point in whyChooseUsMapped.choose_us_points"
          :key="point.id"
          class="flex flex-col gap-2 items-center justify-center max-tablet:py-4"
        >
          <span
            class="relative size-10 flex items-center justify-center bg-primary/20 rounded-md rounded-br-2xl"
          >
            <nuxt-img
              provider="directus"
              :src="point.icon"
              :alt="point.title"
              class="size-10 object-cover absolute -left-2.5 -top-2.5"
            />
          </span>
          <span
            class="w-full md:w-3/4 flex flex-col items-center justify-center gap-1.5 text-center"
          >
            <h4 class="text-lg font-bold md:text-xl">
              {{ point.title }}
            </h4>
            <p class="text-sm text-black/70 md:text-base font-semibold">
              {{ point.description }}
            </p>
          </span>
        </li>
      </transition-group>
    </div>
  </section>
</template>
<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";

const { $directus } = useNuxtApp();
const elementRef = ref<VNodeRef | null>(null);
const { isInView } = useInView(elementRef);
const { data: whyChooseUs } = useAsyncData(
  QUERY_KEYS.pages.home.whyChooseUs,
  () =>
    $directus.query(`
    query {
        why_choose_us {
            id
            translations {
                languages_id
                headingTitle
                description
            }
        }
        choose_us_points {
            id
            icon
            translations {
                languages_id
                title
                description
            }
        }
    }
`)
);

const { getLocaleObject, currentLocale } = useI18n();
const locale = computed(() => getLocaleObject(currentLocale.value));

const whyChooseUsMapped = computed(() => ({
  ...whyChooseUs.value?.why_choose_us,
  ...whyChooseUs.value?.why_choose_us.translations.find(
    (translation: any) =>
      translation.languages_id.toString() === locale.value.id
  ),
  choose_us_points: whyChooseUs.value?.choose_us_points.map((point: any) => ({
    ...point,
    ...point.translations.find(
      (translation: any) =>
        translation.languages_id.toString() === locale.value.id
    ),
  })),
}));
</script>
<style>
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
