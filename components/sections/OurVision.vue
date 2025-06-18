<template>
  <section
    class="min-h-[50dvh] flex flex-col items-center justify-start container app-container pt-16 gap-2.5"
  >
    <div
      ref="sectionRef"
      class="grid grid-cols-1 md:grid-cols-2 gap-10 tablet:gap-20 items-center justify-start"
    >
      <div class="flex flex-col items-start justify-start gap-1.5">
        <transition name="fade-down" mode="out-in">
          <p
            v-show="isInView"
            class="relative text-primary max-md:text-base text-xs font-bold mb-1 text-start before:absolute before:bottom-0 before:left-0 before:w-full before:rounded-full before:h-1/2 before:bg-gradient-to-t px-2 py-1 before:from-primary/60 isolate"
          >
            {{ ourVisionMapped.title }}
          </p>
        </transition>
        <transition name="fade-down" mode="out-in">
          <h3
            v-show="isInView"
            class="text-3xl md:text-4xl text-start font-bold"
          >
            {{ ourVisionMapped.headingTitle }}
          </h3>
        </transition>
        <transition name="fade-up" mode="out-in">
          <p
            v-show="isInView"
            class="text-start text-sm md:text-base text-black/70 mt-6"
          >
            {{ ourVisionMapped.description }}
          </p>
        </transition>
      </div>
      <ul class="grid grid-cols-2 items-start justify-start gap-3 tablet:gap-5">
        <transition name="fade-up" mode="out-in">
          <li v-show="isInView" class="w-full h-44 rounded-lg overflow-hidden">
            <nuxt-img
              provider="directus"
              :src="ourVisionMapped.firstImage"
              class="w-full h-full object-cover"
            />
          </li>
        </transition>
        <transition name="fade-down" mode="out-in">
          <li v-show="isInView" class="w-full h-44 rounded-lg overflow-hidden">
            <nuxt-img
              provider="directus"
              :src="ourVisionMapped.secondImage"
              class="w-full h-full object-cover"
            />
          </li>
        </transition>
        <div
          class="col-span-2 flex items-start justify-start gap-3 tablet:gap-5"
        >
          <transition name="fade-down" mode="out-in">
            <li
              v-show="isInView"
              class="w-full h-44 rounded-lg overflow-hidden"
            >
              <nuxt-img
                provider="directus"
                :src="ourVisionMapped.thirdImage"
                class="w-full h-full object-cover"
              />
            </li>
          </transition>
          <transition name="fade-up" mode="out-in">
            <li v-show="isInView" class="w-60 h-44 rounded-lg overflow-hidden">
              <nuxt-img
                provider="directus"
                :src="ourVisionMapped.forthImage"
                class="w-full h-full object-cover"
              />
            </li>
          </transition>
        </div>
      </ul>
    </div>
    <!-- time line wrapper element -->
    <div class="w-full flex items-center justify-center py-4">
      <!-- time line component -->
      <div
        class="relative z-10 flex items-center justify-center gap-2 bg-zinc-200 shadow-md w-1 h-20"
      >
        <span
          class="inline-block absolute -top-2.25 size-4.5 bg-primary rounded-full"
        />
        <span
          class="inline-block absolute -bottom-2.25 size-4.5 bg-secondary rounded-full"
        />
        <span
          class="inline-block absolute -top-1.5 size-3 bg-zinc-200 rounded-full"
        />
        <span
          class="inline-block absolute -bottom-1.5 size-3 bg-zinc-200 rounded-full"
        />
        <span
          class="inline-block w-full h-full absolute -bottom-1 size-2 bg-zinc-200 rounded-full"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";

const { $directus } = useNuxtApp();
const sectionRef = ref<HTMLElement | null>(null);
const { isInView } = useInView(sectionRef, {
  threshold: 0.3,
});
const { data: ourVision } = useAsyncData(QUERY_KEYS.pages.home.ourVision, () =>
  $directus.query(`
    query {
        our_vision {
            id
            translations {
                languages_id
                title
                headingTitle
                description
            }
            firstImage
            secondImage
            thirdImage
            forthImage
        }
    }
`)
);

const { getLocaleObject, currentLocale } = useI18n();
const locale = computed(() => getLocaleObject(currentLocale.value));

const ourVisionMapped = computed(() => ({
  ...ourVision.value?.our_vision,
  ...ourVision.value?.our_vision.translations.find(
    (translation: unknown) =>
      translation.languages_id.toString() === locale.value.id
  ),
}));
</script>
