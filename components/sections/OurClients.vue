<template>
  <section ref="sectionRef" class="container app-container pt-16">
    <div class="flex flex-col items-center justify-center mb-6 w-full">
      <transition name="fade-down">
        <p
          v-show="isInView"
          class="relative text-secondary max-md:text-base text-xs font-bold mb-1 text-center before:absolute before:bottom-0 before:left-0 before:w-full before:rounded-full before:h-1/2 before:bg-gradient-to-t px-2 py-1 before:from-secondary/60 isolate"
        >
          {{ ourCustomersMapped?.title }}
        </p>
      </transition>
      <transition name="fade-up" mode="out-in">
        <h2
          v-show="isInView"
          class="text-[32px] md:text-4xl font-bold text-center mb-2"
        >
          {{ ourCustomersMapped?.headingTitle }}
        </h2>
      </transition>
    </div>

    <!-- Embla -->
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
const sectionRef = ref<HTMLElement | null>(null);
const { isInView } = useInView(sectionRef, {
  threshold: 0.3,
});
const { $directus } = useNuxtApp();
const [emblaRef, emblaApi] = useEmblaCarousel(
  {
    loop: true,
    axis: "x",
    align: "end",
    direction: "ltr",
  },
  [
    AutoScroll({
      speed: 0.7,
      playOnInit: true,
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
</script>

<style>
.embla {
  max-width: 80%;
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
  flex: 0 0 var(--slide-size);
  min-width: 3.25rem;
  height: 2.25rem;
  /* margin-left: var(--slide-spacing); */
}
.embla__slide img {
  height: 90%;
  object-fit: contain;
  justify-self: center;
}
</style>
