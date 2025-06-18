<template>
  <div
    ref="sectionRef"
    class="app-container flex flex-col justify-start items-start gap-2 mt-16 pb-8"
  >
    <span
      class="w-full tablet:w-[calc(100%-20rem)] flex flex-col gap-3 ms-auto mb-8"
    >
      <transition name="fade-down" mode="out-in">
        <p
          v-show="isInView"
          class="relative w-fit delay-150 text-secondary max-md:text-base text-xs font-bold mb-1 before:absolute before:bottom-0 before:left-0 before:w-full before:rounded-full before:h-1/2 before:bg-gradient-to-t px-2 py-1 before:from-secondary/60 isolate"
        >
          {{ about?.aboutUsTitle }}
        </p>
      </transition>
      <transition name="fade-up" mode="out-in">
        <h4
          v-show="isInView"
          class="delay-300 text-black font-bold text-[18px] lg:text-[24px] text-start ltr:leading-tight"
        >
          {{ about?.aboutUsBrief }}
        </h4>
      </transition>
    </span>
    <about-info-box
      :description="about?.aboutUsHeadingDescription"
      :person-image="
        img(about?.aboutUsPersonImage, undefined, {
          provider: 'directus',
        })
      "
      :background="
        img(about?.aboutUsSectionImage, undefined, {
          provider: 'directus',
        })
      "
    />
  </div>
</template>
<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";

const { $directus } = useNuxtApp();
const { currentLocale, getLocaleObject } = useI18n();
const sectionRef = ref<HTMLElement | null>(null);
const { isInView } = useInView(sectionRef, {
  rootMargin: "-100px",
});
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
    // aboutUsSectionImage: img(
    //   aboutData.value?.home?.aboutUsSectionImage,
    //   undefined,
    //   {
    //     provider: "directus",
    //   }
    // ),
    // aboutUsPersonImage: img(
    //   aboutData.value?.home?.aboutUsPersonImage,
    //   undefined,
    //   {
    //     provider: "directus",
    //   }
    // ),
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
