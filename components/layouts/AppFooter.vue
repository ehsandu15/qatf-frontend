<template>
  <footer
    class="bg-primary text-white bg-fixed bg-cover bg-no-repeat bg-center"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="bg-primary/80 flex items-center justify-center flex-col">
      <!-- Main Footer Content -->
      <div
        class="w-full flex items-start md:items-center justify-between max-md:gap-7 gap-20 border-white/30 max-lg:flex-wrap"
      >
        <!-- Description & Logo -->
        <div
          class="md:container md:mx-auto md:app-container max-md:bg-primary py-10 flex flex-col md:flex-row items-center justify-between"
        >
          <div
            class="app-container flex flex-col items-start md:col-span-2 space-y-4 text-right w-full md:w-1/3"
          >
            <NuxtImg
              provider="directus"
              :src="`${data?.appFooter?.logoImage}`"
              alt="Qatf Farm Logo White"
              class="h-15 mb-4"
            />
            <p class="text-sm opacity-80 text-start leading-relaxed">
              {{ appFooter.description }}
            </p>
            <!-- Social Media Icons -->
            <div
              v-if="data?.appFooter.socialMedia"
              class="w-full flex justify-start gap-4 pt-4 max-md:w-full"
            >
              <a
                v-for="platform of appFooter.socialMedia"
                :key="platform.id"
                :href="platform.platformUrl"
                :aria-label="platform.platformUrl"
                class="hover:opacity-80 size-12 bg-primary/50 rounded-full"
              >
                <NuxtImg
                  provider="directus"
                  :src="`${platform.icon}`"
                  :alt="platform.id"
                  class="w-full"
                />
              </a>
            </div>
          </div>
          <!-- Navigation Links -->
          <nav
            v-if="appFooter.websiteLinks"
            class="app-container md:w-1/2 flex flex-wrap gap-x-6 gapy-3 items-center justify-center h-fit self-center max-md:pt-10 font-semibold"
          >
            <template v-for="link of appFooter.websiteLinks" :key="link.id">
              <NuxtLink
                v-if="link.path && !link.path.match(/^\[.*\]$/)"
                :to="pathWithLocale(link.path)"
                class="block hover:underline"
                >{{ link.title }}</NuxtLink
              >
              <button
                v-if="!link.path || link.path.match(/^\[.*\]$/)"
                type="button"
                @click="showModal"
              >
                {{ link.title }}
              </button>
            </template>
          </nav>

          <!-- Contact Info -->
        </div>
        <div class="app-container w-full md:w-1/3 space-y-4 max-md:py-6">
          <h3 class="text-xl font-semibold mb-4">
            {{ appFooter.headingTitle }}
          </h3>
          <div class="not-italic space-y-4 rtl:text-end">
            <span
              class="block p-2 bg-gradient-to-r from-primary/90 to-[#ffffff96] rounded-lg before:rounded-lg relative before:absolute before:content-[''] before:inset-[1px] before:bg-gradient-to-r before:from-primary/50 before:to-primary/80"
            >
              <nuxt-link
                dir="ltr"
                :href="`tel:${appFooter.contactPhone}`"
                class="block hover:underline isolate"
                >{{ appFooter.contactPhone }}</nuxt-link
              >
              <nuxt-link
                :href="`mailto:${appFooter.contactEmail}`"
                class="block hover:underline text-start isolate"
                >{{ appFooter.contactEmail }}</nuxt-link
              >
            </span>
            <span
              class="block p-2 bg-gradient-to-l from-primary/90 to-[#ffffff96] rounded-lg before:rounded-lg relative before:absolute before:content-[''] before:inset-[1px] before:bg-gradient-to-l before:from-primary/50 before:to-primary/80"
            >
              <address class="isolate p-3">
                {{ appFooter.address }}
              </address>
            </span>
          </div>
        </div>
      </div>

      <!-- Copyright & Policy -->
      <div
        class="w-full flex flex-col md:flex-row justify-between items-center text-sm text-white/80 bg-primary/40 brightness-150 py-6 mt-6"
      >
        <span
          class="w-full app-container max-md:flex-wrap flex items-center justify-between"
        >
          <p class="max-md:w-full text-center">
            {{
              appFooter.copyRightsText?.replace(
                " {copyRightYear}",
                copyRightYear
              )
            }}
          </p>
          <NuxtLink
            :to="pathWithLocale('/privacy-and-terms')"
            class="hover:underline mt-2 md:mt-0 max-md:w-full text-center"
            >{{ appFooter.termsOfPrivacyLabel }}</NuxtLink
          >
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { QUERY_KEYS } from "~/constants/query-keys";

const copyRightYear = shallowRef(new Date().getFullYear());
const { $directus } = useNuxtApp();
const { showModal } = useShowCartModal();
const { currentLocale, getLocaleObject, pathWithLocale } = useI18n();
const img = useImage();
const { data } = await useAsyncData(QUERY_KEYS.globalConfig.appFooter, () =>
  $directus.query(
    `
    query {
      appFooter {
        id
        logoImage
        backgroundImage
        socialMedia (filter: { status: { _eq: "published" } }) {
          id
          icon
          platformUrl
        }
        websiteLinks (filter: { status: { _eq: "published" } }) {
          id
          translations {
            id
            title
            languages_id
          }
          path
        }
        translations {
          id
          headingTitle
          description
          contactPhone
          contactEmail
          copyRightsText
          termsOfPrivacyLabel
          address
        }
      }
    }
`
  )
);
const appFooter = computed(() => {
  return {
    ...data.value.appFooter,
    ...data.value.appFooter.translations.find(
      (t) => t.id === getLocaleObject(currentLocale.value).id
    ),
    websiteLinks: data.value.appFooter.websiteLinks.map((link) => ({
      ...link,
      ...link.translations.find(
        (t) =>
          t.languages_id.toString() === getLocaleObject(currentLocale.value).id
      ),
    })),
  };
});

const backgroundImage = img(data.value.appFooter.backgroundImage, undefined, {
  provider: "directus",
});
</script>
