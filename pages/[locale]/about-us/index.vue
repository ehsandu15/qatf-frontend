<template>
  <section
    class="app-container flex gap-5 items-start justify-start my-8 md:my-16 flex-col"
  >
    <!-- about us hero -->
    <div class="w-full">
      <span
        class="w-full tablet:w-[calc(100%-20rem)] flex flex-col gap-3 ms-auto mb-8"
      >
        <p
          class="relative w-fit text-secondary max-md:text-base text-xs font-bold mb-1 before:absolute before:bottom-0 before:left-0 before:w-full before:rounded-full before:h-1/2 before:bg-gradient-to-t px-2 py-1 before:from-secondary/60 isolate"
        >
          {{ aboutUs?.headingTitle }}
        </p>
        <h4
          class="text-black font-bold text-[18px] lg:text-[24px] text-start ltr:leading-tight"
        >
          {{ aboutUs?.BriefText }}
        </h4>
      </span>

      <about-info-box
        :description="aboutUs?.descriptionText"
        :person-image="
          img(aboutUs?.personImage, undefined, {
            provider: 'directus',
          })
        "
        :background="
          img(aboutUs?.image, undefined, {
            provider: 'directus',
          })
        "
      />

      <!-- about-us features box's -->
      <div
        class="w-full grid grid-cols-2 items-center justify-start gap-4 mt-8"
      >
        <span
          class="min-h-[146px] relative flex items-center justify-center p-5 bg-black rounded-[20px]"
        >
          <span
            class="absolute w-full top-0 pe-2 left-0 rtl:rounded-tr-[20px] ltr:rounded-tl-[20px] overflow-hidden flex items-center justify-between"
          >
            <span
              class="px-4 py-3 md:px-6 md:py-5 text-white max-md:text-xs bg-zinc-900 flex items-center justify-center rtl:rounded-bl-full ltr:rounded-br-full ltr:rounded-bl-none"
            >
              <p>{{ aboutUs.secondaryBoxTitle }}</p>
            </span>
            <span
              class="flex size-8 md:size-10 p-1.5 md:p-2 relative bg-white rounded-full"
            >
              <span class="size-full rounded-full flex bg-black" />
            </span>
          </span>
          <h3
            class="text-white mt-14 md:mt-24 pb-5 tablet:lg-8 text-base tablet:text-xl font-bold max-w-full overflow-hidden truncate"
          >
            {{ aboutUs.secondaryBoxDescription }}
          </h3>
        </span>
        <span
          class="min-h-[146px] relative flex items-center justify-center p-5 bg-primary rounded-[20px]"
        >
          <span
            class="absolute w-full top-0 ps-2 left-0 rtl:rounded-tl-[20px] ltr:rounded-tr-[20px] overflow-hidden flex items-center justify-between flex-row-reverse"
          >
            <span
              class="px-4 py-3 md:px-6 md:py-5 text-white max-md:text-xs bg-primary brightness-110 flex items-center justify-center rtl:rounded-br-full ltr:rounded-bl-full"
            >
              <p>{{ aboutUs.primaryBoxTitle }}</p>
            </span>
            <span
              class="flex size-8 md:size-10 p-1.5 md:p-2 relative bg-white rounded-full"
            >
              <span class="size-full rounded-full flex bg-primary" />
            </span>
          </span>
          <h3
            class="text-white mt-14 md:mt-24 pb-5 lg:px-8 text-base tablet:text-xl font-bold max-w-full overflow-hidden truncate"
          >
            {{ aboutUs.primaryBoxDescription }}
          </h3>
        </span>
      </div>
    </div>
    <sections-posters class="!max-w-full w-full !px-0" />
    <lazy-sections-our-vision class="!max-w-full w-full !px-0" />
    <lazy-sections-our-goals class="!max-w-full w-full !px-0" />
    <div class="w-full flex flex-col items-center justify-center mt-16">
      <h3
        class="text-[32px] tablet:text-4xl font-semibold tablet:font-bold text-center mb-4"
      >
        {{ aboutUs.whySectionTitle }}
      </h3>
      <h2
        class="text-[32px] tablet:text-4xl font-semibold tablet:font-bold text-black/20 text-center mb-8"
      >
        {{ aboutUs.whySectionDescription }}
      </h2>
      <ul
        v-if="aboutUs.whyItems"
        class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
      >
        <li
          v-for="reason in aboutUs.whyItems"
          :key="reason.id"
          class="flex items-start justify-center p-2 md:p-5 gap-5 bg-white rounded-[20px]"
        >
          <nuxt-img
            provider="directus"
            :src="reason.icon"
            :alt="reason.title"
            class="size-12 object-cover"
          />
          <div>
            <h3
              class="text-lg tablet:text-xl font-semibold text-start text-black mb-2"
            >
              {{ reason.title }}
            </h3>
            <p class="text-base text-black/70 text-start">
              {{ reason.description }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";

const img = useImage();
const { currentLocale, getLocaleObject } = useI18n();
const { $directus } = useNuxtApp();
const { data } = await useAsyncData(QUERY_KEYS.pages.aboutUs, () =>
  $directus.query(
    `
      query {
        aboutUs {
          id
          image
          image
          personImage
          posterFarStartImage
          posterSecondStartImage
          posterCentredImage
          posterSecondEndImage
          posterFarEndImage
          whyItems {
            id
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
            headingTitle
            BriefText
            descriptionText
            primaryBoxTitle
            primaryBoxDescription
            secondaryBoxTitle
            secondaryBoxDescription
            whySectionTitle
            whySectionDescription
          }
        }
      }
    `
  )
);

const aboutUs = computed(() => ({
  ...data.value?.aboutUs,
  whyItems: data.value?.aboutUs.whyItems.map(
    (item: {
      translations: {
        languages_id: number;
        title: string;
        description: string;
      }[];
    }) => ({
      ...item,
      ...item.translations.find(
        (translation: { languages_id: number }) =>
          translation.languages_id.toString() ===
          getLocaleObject(currentLocale.value).id
      ),
      ...item.translations.find(
        (translation) =>
          translation.languages_id.toString() ===
          getLocaleObject(currentLocale.value).id
      ),
    })
  ),
  ...data?.value?.aboutUs.translations.find(
    (translation) =>
      translation.languages_id.toString() ===
      getLocaleObject(currentLocale.value).id
  ),
}));
</script>
