<template>
  <section class="container app-container pt-16">
    <div class="flex flex-col items-center justify-center mb-6 w-full">
      <p
        class="relative text-secondary max-md:text-base text-xs font-bold mb-1 text-center before:absolute before:bottom-0 before:left-0 before:w-full before:rounded-full before:h-1/2 before:bg-gradient-to-t px-2 py-1 before:from-secondary/60 isolate"
      >
        {{ ourCustomersMapped?.title }}
      </p>
      <h2 class="text-[32px] md:text-4xl font-bold text-center mb-2">
        {{ ourCustomersMapped?.headingTitle }}
      </h2>
    </div>
    <div class="embla">
      <div ref="emblaRef" class="embla__viewport">
        <div class="embla__container">
          <div
            v-for="(customer, index) in ourCustomersMapped.customersList"
            :key="`${customer.id}-${index}`"
            class="embla__slide group"
          >
            <nuxt-img
              provider="directus"
              :src="customer.image"
              :alt="customer.image"
              class="object-cover max-w-full grayscale-100 group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";
import { computed } from "vue";
import useEmblaCarousel from "embla-carousel-vue";
import AutoScroll from "embla-carousel-auto-scroll";
import type { DirectUsTranslations } from "~/types/directus";

const { currentLocale, getLocaleObject } = useI18n();

const { $directus } = useNuxtApp();
const [emblaRef] = useEmblaCarousel(
  {
    loop: true,
    startIndex: 0,
    axis: "x",
    direction: getLocaleObject(currentLocale.value).dir as "ltr" | "rtl",
    dragFree: true,
    breakpoints: {
      365: {
        slides: "2.5",
      },
      768: {
        slides: "3.5",
      },
      992: {
        slides: "4.5",
      },
      1024: {
        slides: "6.5",
      },
    },
  },
  [
    AutoScroll({
      playOnInit: true,
      speed: 0.3,
    }),
  ]
);

const { data: ourCustomers } = useAsyncData(
  QUERY_KEYS.pages.home.ourCustomers,
  () =>
    $directus.query(`
    query {
        our_customers {
            id
            translations {
                languages_id
                title
                headingTitle
            }
        }
        customers_list {
            id
            image
            translations {
                languages_id
                brief
            }
        }
    }
`)
);

const locale = computed(() => getLocaleObject(currentLocale.value));

const ourCustomersMapped = computed(() => ({
  ...ourCustomers.value?.our_customers,
  ...ourCustomers.value?.our_customers?.translations?.find(
    (t: DirectUsTranslations) => t.languages_id.toString() === locale.value.id
  ),
  customersList: {
    ...ourCustomers.value?.customers_list,
    ...ourCustomers.value?.customers_list?.translations?.find(
      (t: DirectUsTranslations) => t.languages_id.toString() === locale.value.id
    ),
  },
}));

// onMounted(() => {
//   const autoScroll = emblaApi.value?.plugins().autoScroll;
//   if (!autoScroll) return;

//   autoScroll.play();
// });
</script>

<style>
.embla {
  max-width: 90%;
  margin: auto;
  --slide-height: 19rem;
  --slide-spacing: 5rem;
  --slide-size: 10.5rem;
  overflow: hidden;
}
@media (max-width: 768px) {
  .embla {
    max-width: 100%;
  }
}
.embla__viewport {
  overflow: hidden;
}
.embla__container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  touch-action: pan-y pinch-zoom;
  /* padding-left: calc(var(--slide-spacing) * -1); */
  max-width: 100%;
}
.embla__slide {
  transform: translate3d(0, 0, 0);
  flex: 0 0 var(--slide-size);
  min-width: 3rem;
  height: 2.25rem;
  /* margin-left: var(--slide-spacing); */
}
.embla__slide img {
  height: 90%;
  object-fit: contain;
  justify-self: center;
}
</style>
