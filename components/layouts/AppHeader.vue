<template>
  <header class="relative isolate bg-background border-b border-gray-200">
    <div
      class="app-container flex items-center justify-between py-2 max-tablet:flex-row-reverse"
    >
      <!-- Logo -->
      <nuxt-link :to="pathWithLocale('/')">
        <nuxt-img
          provider="directus"
          :src="appHeader.logo"
          alt="logo"
          class="h-14 tablet:h-10"
        />
      </nuxt-link>
      <button
        v-if="!isOpenMenu"
        type="button"
        class="tablet:hidden"
        @click="isOpenMenu = !isOpenMenu"
      >
        <nuxt-img
          provider="directus"
          :src="appHeader.openSideNaviationMenuIcon"
          alt="open side navigation menu"
          class="h-9"
        />
      </button>
      <button
        v-if="isOpenMenu"
        type="button"
        class="tablet:hidden"
        @click="isOpenMenu = !isOpenMenu"
      >
        <nuxt-img
          provider="directus"
          :src="appHeader.closeSideNaviationMenuIcon"
          alt="close side navigation menu"
          class="h-9"
        />
      </button>
      <!-- Navigation -->
      <nav class="hidden tablet:flex items-center gap-2 rtl:space-x-reverse">
        <NuxtLink
          v-for="link of appHeader.navLinks"
          :key="link.id"
          :to="pathWithLocale(link.path)"
          class="header__nav_link"
          :class="
            $route.path.endsWith(link.path) ? 'header__nav_link_active' : ''
          "
          >{{ link.title }}</NuxtLink
        >
        <!-- <NuxtLink
          to="/about-us"
          class="header__nav_link"
          :class="
            $route.fullPath.endsWith('/about-us')
              ? 'header__nav_link_active'
              : ''
          "
          >من نحن</NuxtLink
        >
        <NuxtLink
          to="/daily-pricing"
          class="header__nav_link"
          :class="
            $route.fullPath.endsWith('/daily-pricing')
              ? 'header__nav_link_active'
              : ''
          "
          >تسعيرة اليوم</NuxtLink
        > -->
      </nav>
      <!-- Actions -->
      <div class="hidden tablet:flex items-center gap-4 rtl:space-x-reverse">
        <button
          type="button"
          class="relative bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
          @click="showModal"
        >
          <p
            v-show="getCartQuantity() > 0"
            class="absolute -top-1.5 -right-3 size-5.5 bg-secondary rounded-full flex items-center justify-center text-xs p-1 text-white overflow-hidden shadow-md"
          >
            {{ getCartQuantity() < 99 ? getCartQuantity() : "99+" }}
          </p>
          <nuxt-img
            provider="directus"
            :src="appHeader.cartButtonIcon"
            alt="open side navigation menu"
            class="h-6"
          />
        </button>
        <div
          class="flex flex-row items-center justify-start gap-2 border border-transparent focus-within:border-gray-300 px-3 rounded-full"
        >
          <select
            :value="currentLocale"
            class="focus:outline-none px-2 py-1 text-sm"
            @change="setLocale($event?.target?.value)"
          >
            <option
              v-for="locale in locales"
              :key="locale.code"
              :value="locale.code"
            >
              {{ locale.name }}
            </option>
          </select>
        </div>
        <NuxtLink
          :href="pathWithLocale(appHeader.ctaButtonHref)"
          class="px-5 py-2 border rounded-full border-black text-black hover:border-primary hover:text-primary transition-colors"
        >
          {{ appHeader.ctaButtonLabel }}
        </NuxtLink>
      </div>

      <!-- mobile nav menu -->
    </div>
  </header>
  <div
    class="fixed top-17 left-0 z-[100] bg-background w-full min-h-screen flex items-start justify-start pt-8 transition-transform"
    :class="isOpenMenu ? 'translate-x-0' : 'translate-x-[150%]'"
  >
    <nav class="w-full grid grid-flow-row h-full gap-2 min-h-full">
      <template v-for="link of appHeader.websiteLinks" :key="link.id">
        <NuxtLink
          v-if="link.path && !link.path.match(/^\[.*\]$/)"
          :to="pathWithLocale(link.path)"
          class="header__nav_link"
          :class="
            $route.path.endsWith(link.path) ? 'header__nav_link_active' : ''
          "
        >
          <p class="w-full text-start" @click="isOpenMenu = false">
            {{ link.title }}
          </p>
        </NuxtLink>
        <button
          v-if="!link.path || link.path.match(/^\[.*\]$/)"
          type="button"
          class="py-1.5 px-3 text-start capitalize"
          @click="handleShowCartModal"
        >
          {{ link.title }}
        </button>
      </template>
      <div
        class="w-full flex flex-row items-center justify-start gap-2 border border-transparent focus-within:bg-primary/20 focus-within:border-gray-300 px-2"
      >
        <select
          :value="currentLocale"
          class="focus:outline-none ltr:ps-2 rtl:pe-2 py-1 text-sm w-1/4"
          @change="setLocale($event?.target?.value)"
        >
          <option
            v-for="locale in locales"
            :key="locale.code"
            :value="locale.code"
          >
            {{ locale.name }}
          </option>
        </select>
      </div>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";

const isOpenMenu = shallowRef(false);
const { showModal } = useShowCartModal();
const { getCartQuantity } = useCart();
const { $directus } = useNuxtApp();
const { locales, setLocale, currentLocale, getLocaleObject, pathWithLocale } =
  useI18n();
const handleShowCartModal = () => {
  isOpenMenu.value = false;
  showModal();
};

const { data } = await useAsyncData(QUERY_KEYS.globalConfig.appHeader, () =>
  $directus.query(`
    query {
      appFooter {
        websiteLinks (filter: { status: { _eq: "published" } }) {
          id
          translations {
            id
            title
            languages_id
          }
          path
        }
      }
      appHeader {
        id
        logo
        openSideNaviationMenuIcon
        closeSideNaviationMenuIcon
        cartButtonIcon
        ctaButtonHref
        navLinks (filter: { status: { _eq: "published" } }) {
          id
          translations {
            id
            languages_id
            title
          }
          path
        }
        translations {
          id
          ctaButtonLabel
          languages_id
        }
      }
    }
  `)
);
const appHeader = computed(() => {
  return {
    ...data.value?.appHeader,
    ...data.value?.appHeader?.translations.find(
      (t: { languages_id: number; ctaButtonLabel: string }) =>
        t.languages_id.toString() === getLocaleObject(currentLocale.value).id
    ),
    navLinks: data.value?.appHeader?.navLinks.map(
      (link: { translations: { languages_id: number; title: string }[] }) => ({
        ...link,
        ...link.translations.find(
          (t: { languages_id: number; title: string }) =>
            t.languages_id.toString() ===
            getLocaleObject(currentLocale.value).id
        ),
      })
    ),
    websiteLinks: data.value?.appFooter?.websiteLinks.map(
      (link: { translations: { languages_id: number; title: string }[] }) => ({
        ...link,
        ...link.translations.find(
          (t: { languages_id: number; title: string }) =>
            t.languages_id.toString() ===
            getLocaleObject(currentLocale.value).id
        ),
      })
    ),
  };
});

// prevent scroll on body when menu is open based in ( isOpenMenu )
useHead({
  bodyAttrs: {
    class: () => (isOpenMenu.value ? "overflow-hidden" : ""),
  },
});
</script>
