<template>
  <div
    class="app-container flex flex-col justify-start items-start gap-2 mt-16 pb-8"
  >
    <span
      class="w-full tablet:w-[calc(100%-20rem)] flex flex-col gap-3 ms-auto mb-8"
    >
      <p
        class="relative w-fit text-secondary max-md:text-base text-xs font-bold mb-1 before:absolute before:bottom-0 before:left-0 before:w-full before:rounded-full before:h-1/2 before:bg-gradient-to-t px-2 py-1 before:from-secondary/60 isolate"
      >
        {{ about?.aboutUsTitle }}
      </p>
      <h4
        class="text-black font-bold text-[18px] lg:text-[24px] text-start ltr:leading-tight"
      >
        {{ about?.aboutUsBrief }}
      </h4>
    </span>

    <div class="w-full relative">
      <figure
        class="w-full h-[80dvh] tablet:h-96 overflow-hidden rounded-2xl bg-no-repeat bg-cover bg-center"
        :style="{
          backgroundImage: `url(${about?.aboutUsSectionImage})`,
        }"
      >
        <div
          class="absolute inset-0 flex items-center justify-start max-tablet:flex-col gap-5 bg-neutral-700/40 rounded-2xl tablet:py-20 tablet:pe-10 p-6"
        >
          <div
            class="absolute bottom-0 max-tablet:bottom-0 rtl:tablet:-right-3 ltr:tablet:-left-3 max-tablet:w-full max-w-full max-h-1/2 tablet:max-w-[30%]"
          >
            <NuxtImg
              :src="about?.aboutUsPersonImage"
              :alt="about?.aboutUsTitle"
              class="max-w-1/2 tablet:max-w-full object-cover rounded-2xl"
            />
          </div>
          <p
            class="text-white text-base tablet:text-xl lg:text-2xl font-semibold text-center w-full max-md:max-h-1/2 tablet:max-w-[70%] ms-auto"
          >
            {{ about?.aboutUsHeadingDescription }}
          </p>
        </div>
      </figure>
    </div>
  </div>
</template>
<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";

const { $directus } = useNuxtApp();
const { currentLocale, getLocaleObject } = useI18n();

const { data: aboutData } = await useAsyncData(
  QUERY_KEYS.pages.home.about,
  () =>
    $directus.query(`
  query {
    home {
      aboutUsSectionImage
      aboutUsPersonImage
      translations {
        id
        languages_id
        aboutUsTitle
        aboutUsBrief
        aboutUsHeadingDescription
      }
    }
  }
`)
);
const img = useImage();

const about = computed(() => {
  return {
    ...aboutData.value?.home,
    aboutUsSectionImage: img(
      aboutData.value?.home?.aboutUsSectionImage,
      undefined,
      {
        provider: "directus",
      }
    ),
    aboutUsPersonImage: img(
      aboutData.value?.home?.aboutUsPersonImage,
      undefined,
      {
        provider: "directus",
      }
    ),
    ...aboutData.value?.home?.translations.find(
      (t: {
        languages_id: number;
        aboutHeadingTitle: string;
        aboutHeadingDescription: string;
      }) =>
        t.languages_id.toString() === getLocaleObject(currentLocale.value).id
    ),
  };
});
</script>
