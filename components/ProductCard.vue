<template>
  <div ref="cardRef" class="flex items-center justify-center">
    <Transition name="scale-enter" mode="out-in">
      <div
        v-show="isInView"
        class="product-card rounded-xl bg-white flex flex-col items-center p-1 tablet:p-4 relative"
      >
        <div class="relative">
          <span
            v-if="product.tags && product.tags.length"
            class="max-w-full absolute top-0 right-0 p-2 md:px-3 md:py-4 flex gap-1 md:gap-2 rtl:right-2 rtl:left-auto ltr:left-2 ltr:right-auto max-sm:flex-wrap"
          >
            <span
              v-for="tag in product.tags"
              :key="tag"
              :class="tagClass(tag)"
              class="text-xs font-bold p-1 md:px-2 md:py-1 rounded"
            >
              {{ tag }}
            </span>
          </span>
          <nuxt-img
            provider="directus"
            :src="product.image"
            :alt="product.title"
            class="rounded-[20px] max-w-full min-w-full min-h-[100px] tablet:min-h-[250px] object-cover"
          />
          <button
            class="add-btn absolute left-1 bottom-1 tablet:left-4 tablet:bottom-4 bg-primary text-white rounded-md md:rounded-[10px] size-7 md:w-9 md:h-9 flex items-center justify-center mt-2 hover:bg-primary transition-colors"
            :class="isInTheCart ? 'bg-slate-500' : 'bg-primary'"
            :disabled="Boolean(isInTheCart)"
            title="Add to cart"
            @click="$emit('on-add-to-cart', product)"
          >
            <svg
              v-if="!isInTheCart"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-plus-icon lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              title="Remove from cart"
              @click="$emit('on-remove-from-cart', product)"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M8.106 2.553A1 1 0 0 1 9 2h6a1 1 0 0 1 .894.553L17.618 6H20a1 1 0 1 1 0 2h-1v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8H4a1 1 0 0 1 0-2h2.382zM14.382 4l1 2H8.618l1-2zM11 11a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0zm4 0a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div class="mt-2 text-center">
          <div class="font-bold text-sm md:text-base mb-1">
            {{ product.title }}
          </div>
          <div
            class="text-gray-500 text-xs md:text-sm mb-1 flex items-center justify-center gap-2.5"
          >
            <span class="flex items-center justify-center gap-1">
              <p class="text-primary">{{ product.price }}</p>
              <p v-if="product.currency" class="text-primary">
                {{ product.currency }}
              </p>
            </span>
            <span v-if="product.unit">( {{ product.unit.name || "--" }} )</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@/types/product";

const { isInTheCart: inCart } = useCart();
const { currentLocale, getLocaleObject } = useI18n();
const props = defineProps<{
  data: Product;
}>();

const product = computed(() => ({
  ...props.data,
  ...props.data.translations.find(
    (translation) =>
      translation.languages_id.toString() ===
      getLocaleObject(currentLocale.value).id
  ),
  id: props.data.id,
  unit: props.data.unit?.translations?.find(
    (translation: { languages_id: number }) =>
      translation.languages_id.toString() ===
      getLocaleObject(currentLocale.value).id
  ),
  category: props.data.category?.translations.find(
    (translation: { languages_id: number }) =>
      translation.languages_id.toString() ===
      getLocaleObject(currentLocale.value).id
  ),
}));

const isInTheCart = computed(() => inCart(props.data));
const cardRef = ref<HTMLElement | null>(null);
const { isInView } = useInView(cardRef, {
  rootMargin: "30px",
});

defineEmits<{
  (e: "on-add-to-cart", data: Product): void;
  (e: "on-remove-from-cart", data: Product): void;
}>();

function tagClass(tag: string) {
  if (tag === "عرض خاص") return "bg-red-500 text-white";
  if (tag === "كمية محدودة") return "bg-yellow-400 text-black";
  return "bg-red-500 text-white";
}
</script>

<style scoped>
.product-card {
  min-width: 180px;
  min-height: 260px;
}
@media screen and (max-width: 467px) {
  .product-card {
    min-width: fit-content;
    min-height: fit-content;
  }
}
.add-btn {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
