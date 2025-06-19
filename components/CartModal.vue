<template>
  <Modal :is-open="isOpen">
    <div
      class="flex items-start justify-start flex-col p-6 bg-background rounded-[10px] w-11/12 sm:w-10/12 md:w-7/12 lg:w-1/2"
    >
      <span class="flex items-center justify-between w-full mb-8">
        <h3 class="text-xl font-semibold">
          {{ cartContent.modalTitle }}
        </h3>
        <button
          type="button"
          class="items-center justify-center size-6"
          @click="emits('close-modal')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.6673 2.48086L21.3173 0.130859L12.0007 9.44753L2.68398 0.130859L0.333984 2.48086L9.65065 11.7975L0.333984 21.1142L2.68398 23.4642L12.0007 14.1475L21.3173 23.4642L23.6673 21.1142L14.3507 11.7975L23.6673 2.48086Z"
              fill="black"
            />
          </svg>
        </button>
      </span>
      <form
        action=""
        class="w-full grid grid-cols-1 items-start justify-start sm:grid-cols-2 gap-4"
      >
        <div class="w-full flex flex-col gap-2">
          <label
            for="company-name"
            class="capitalize text-[14px] font-semibold"
            >{{ cartContent.modalCompanyNameLabel }}</label
          >
          <input
            id="company-name"
            v-model="form.companyName"
            type="text"
            name="company-name"
            class="border border-gray-300 rounded-lg p-2"
            @blur="touched.companyName = true"
          />
          <span
            v-if="!form.companyName && touched.companyName"
            class="text-red-500 text-xs"
            >{{
              cartContent.modalCompanyValidationMessage ||
              "يجب أن يكون اسم الشركة أو المؤسسة مكونًا من حرفًا واحدًا على الأقل"
            }}</span
          >
        </div>
        <div class="w-full flex flex-col gap-2">
          <label
            for="phone-number"
            class="text-[14px] font-semibold text-start capitalize"
          >
            {{ cartContent.modalPhoneNumberLabel }}
          </label>
          <phone-input
            id="phone-number"
            v-model:country-code="form.countryCode"
            v-model:phone-number="form.phone"
            name="phone-number"
            select-element-id="country-code"
            select-element-name="country-code"
            class="py-0.5 w-full"
            @blur="touched.phone = true"
          />
          <span
            v-if="!form.phone && touched.phone"
            class="text-red-500 text-xs"
            >{{
              cartContent.modalPhoneValidationMessage ||
              "يجب أن يكون رقم الهاتف مكونًا من 10 أرقام"
            }}</span
          >
        </div>
        <div class="w-full flex flex-col gap-2">
          <label
            for="is-order-before"
            class="text-[14px] font-semibold capitalize"
          >
            {{ cartContent.modalOrderedBefore }}
          </label>
          <select
            id="is-order-before"
            v-model="form.isOrderedBefore"
            name="is-order-before"
            class="border border-gray-300 rounded-lg py-1 px-2 ltr:py-2.5"
            @blur="touched.isOrderedBefore = true"
          >
            <option
              v-for="option in cartContent.modalOrderedBeforeOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <span
            v-if="!form.isOrderedBefore && touched.isOrderedBefore"
            class="text-red-500 text-xs"
            >{{
              cartContent.modalOrderValidationMessage ||
              "يجب اختيار إجابة صالحة"
            }}</span
          >
        </div>
        <div class="w-full flex flex-col gap-2">
          <label for="activity" class="text-[14px] font-semibold capitalize">{{
            cartContent.modalActivityFormLabel
          }}</label>
          <input
            id="activity"
            v-model="form.activity"
            type="text"
            name="activity"
            class="border border-gray-300 rounded-lg p-2"
            @blur="touched.activity = true"
          />
          <span
            v-if="!form.activity && touched.activity"
            class="text-red-500 text-xs"
            >{{
              cartContent.modalActivityValidationMessage ||
              "يجب أن يكون النشاط مكونًا من حرفًا واحدًا على الأقل"
            }}</span
          >
        </div>
      </form>
      <ul
        class="grid grid-flow-row mt-6 gap-3.5 w-full max-h-52 overflow-y-auto py-3"
      >
        <cart-item
          v-for="item of cart"
          :key="item.id"
          :data="item"
          @increase-quantity="$emit('increase-quantity', $event)"
          @decrease-quantity="$emit('decrease-quantity', $event)"
          @remove-item="emits('remove-item', $event)"
        />
      </ul>
      <span
        class="w-full mt-4 flex items-center justify-between font-semibold text-lg text-black"
      >
        <p>{{ cartContent.modalTotalLabel }}</p>
        <span class="flex items-center justify-center gap-6">
          <p>
            {{
              Intl.NumberFormat(currentLocale, {
                style: "currency",
                currency: "SAR",
              }).format(totalPrice || 0)
            }}
          </p>
        </span>
      </span>
      <button
        v-if="!isSuccess && !isError"
        type="button"
        class="flex items-center justify-center gap-2.5 bg-secondary rounded-full py-2 px-5 w-full text-white mt-8 disabled:bg-slate-400"
        :disabled="isLoading || isError || !isValidForm"
        @click="handleSubmit"
      >
        <span
          v-if="isLoading"
          class="flex border-4 size-8 rounded-full border-slate-600 border-r-transparent animate-spin"
        />
        <p v-if="!isLoading">
          {{ cartContent.modalSubmitButton }}
        </p>
      </button>
      <button
        v-if="isSuccess"
        type="button"
        class="rounded-full py-2 px-5 w-full text-white mt-8 bg-emerald-600"
      >
        {{ cartContent.modalOrderSendSuccessMessage || "تم إضافة الطلب بنجاح" }}
      </button>
      <button
        v-if="isError"
        type="button"
        class="rounded-full truncate overflow-hidden max-w-full py-2 px-5 w-full text-white mt-8 bg-red-600"
      >
        {{
          errorMsg ||
          cartContent.modalOrderSendErrorMessage ||
          "حدث خطأ أثناء إضافة الطلب"
        }}
      </button>
      <div
        v-if="orderTicketId"
        class="w-full flex items-center justify-between mt-6 bg-zinc-100 px-2 py-4 rounded-lg"
      >
        <span class="flex items-center justify-center gap-2">
          <span>{{ cartContent.orderNo }}</span>
          <strong class="underline">{{ orderTicketId }}</strong>
        </span>
        <button
          v-if="!isCopied"
          type="button"
          class="text-gray-600"
          @click="handleCopyTicketId(orderTicketId?.toString())"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
          >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path
              d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            />
            <path d="M16 4h2a2 2 0 0 1 2 2v4" />
            <path d="M21 14H11" />
            <path d="m15 10-4 4 4 4" />
          </svg>
        </button>
        <button v-if="isCopied" type="button" class="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-clipboard-check-icon lucide-clipboard-check"
          >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path
              d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
            />
            <path d="m9 14 2 2 4-4" />
          </svg>
        </button>
      </div>
    </div>
  </Modal>
</template>
<script setup lang="ts">
import { QUERY_KEYS } from "~/constants/query-keys";
import type { CartType, CreateCartItemType } from "~/types/cart";
import type { DirectUsTranslations } from "~/types/directus";

const emits = defineEmits<{
  (e: "close-modal"): void;
  (e: "increase-quantity", product: CartType): void;
  (e: "decrease-quantity", product: CartType): void;
  (e: "remove-item", product: CartType): void;
}>();
const props = defineProps<{
  isOpen: boolean;
  cart: CartType[];
  totalPrice: number;
}>();

const { $directus } = useNuxtApp();
const isError = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isSuccess = ref<boolean>(false);
const errorMsg = ref<null | string>(null);
const { getLocaleObject, currentLocale } = useI18n();
const { clearCart } = useCart();
const { data } = await useAsyncData(QUERY_KEYS.pages.cartContent, () =>
  $directus.query(
    `
      query {
        productsPricing {
          id
          translations {
            id
            languages_id
            modalTitle
            modalPhoneNumberLabel
            modalCompanyNameLabel
            modalOrderedBefore
            modalActivityFormLabel
            modalTotalLabel
            modalSubmitButton
            modalPhoneValidationMessage
            modalCompanyValidationMessage
            modalOrderValidationMessage
            modalActivityValidationMessage
            modalOrderedBeforeOptions
            modalOrderSendSuccessMessage
            modalOrderSendErrorMessage
            orderNo
          }
        }
      }
    `
  )
);
const cartContent = computed(() => ({
  ...data.value?.productsPricing,
  ...data.value?.productsPricing.translations.find(
    (translation: { languages_id: number }) =>
      translation.languages_id.toString() ===
      getLocaleObject(currentLocale.value).id
  ),
}));
const form = reactive({
  companyName: "",
  phone: "",
  countryCode: "+966",
  activity: "",
  isOrderedBefore: cartContent.value.modalOrderedBeforeOptions?.[0],
});
const touched = reactive({
  companyName: false,
  phone: false,
  activity: false,
  isOrderedBefore: false,
});
const isValidForm = computed(() => {
  return (
    form.companyName &&
    form.phone &&
    form.countryCode &&
    form.activity &&
    form.isOrderedBefore &&
    props.cart.length > 0
  );
});
const isCopied = ref<boolean>(false);
const copyTicketTimeoutRef = ref<NodeJS.Timeout | null>(null);
const orderTicketId = shallowRef<number | null>(null);

const resetForm = () => {
  form.companyName = "";
  form.phone = "";
  form.countryCode = "+966";
  form.activity = "";
  form.isOrderedBefore = false;
  touched.companyName = false;
  touched.phone = false;
  touched.activity = false;
  touched.isOrderedBefore = false;
};

const handleCopyTicketId = (ticketId: string | undefined) => {
  if (copyTicketTimeoutRef.value) {
    clearTimeout(copyTicketTimeoutRef.value);
  }
  if (orderTicketId.value) {
    navigator.clipboard.writeText(ticketId);
    isCopied.value = true;
    copyTicketTimeoutRef.value = setTimeout(() => {
      isCopied.value = false;
    }, 3000);
  }
};

const createCartItems = async ({
  cartId,
  onSuccess,
  onError,
}: {
  cartId: number;
  onSuccess: (response: unknown) => void;
  onError: (error: string) => void;
}) => {
  try {
    const items: CreateCartItemType[] = props.cart.map((item) => ({
      productId: Number(item.id),
      cartId: cartId,
      quantity: item.quantity,
      productName:
        item?.translations?.find(
          (translation: DirectUsTranslations) =>
            translation.languages_id.toString() ===
            getLocaleObject(currentLocale.value).id
        )?.title || item.translations[0].title,
      unitPrice: item.price,
      total: item.price * item.quantity,
    }));

    items.forEach(async (item) => {
      await $fetch("/api/cart-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: item,
        onResponse: async ({ response }) => {
          if (!response?.ok) {
            onError(response.statusText);
          } else {
            onSuccess(response._data);
          }
        },
      });
    });
  } catch (error) {
    if (import.meta.dev) {
      console.error(error);
      throw new Error("create cart items failed");
    } else {
      throw new Error("create cart items failed");
    }
  }
};

const handleSubmit = async () => {
  try {
    // prepare cart body calculate total price and user info
    const totalPrice = calculateTotalPrice(props.cart);
    const userInfo = {
      companyName: form.companyName,
      phoneNumber: `${form.countryCode}${form.phone}`,
      activity: form.activity,
      isOrderedBefore: form.isOrderedBefore,
    };

    await $fetch<{ id: number }>("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        form: userInfo,
        totalPrice,
      },
      onResponse: async ({ response }) => {
        if (!response?.ok) {
          throw new Error(`Cart creation failed, ${response?.statusText}`);
        }
        if (!response._data.data.data.id) {
          throw new Error("Cart ID is not found");
        }
        const ticketId = response._data.data.data.ticketId;
        orderTicketId.value = ticketId || null;
        await createCartItems({
          cartId: response._data.data.data.id,
          onSuccess: () => {
            resetForm();
            clearCart();
            isSuccess.value = true;
            isLoading.value = false;
            isError.value = false;
          },
          onError: (error: string) => {
            isLoading.value = false;
            isError.value = true;
            errorMsg.value = error || "create cart items failed";
          },
        });
      },
    });
  } catch (error: unknown) {
    isLoading.value = false;
    isError.value = true;
    errorMsg.value = error instanceof Error ? error.message : "Unknown error";
    if (import.meta.dev) {
      console.error(error);
    } else {
      console.error("create cart failed");
    }
  }
};

const calculateTotalPrice = (items: CartType[]) => {
  let totalPrice = 0;
  items.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  return totalPrice;
};

watch(isError, (val, oldVal, onCleanup) => {
  let timeoutRef: number;
  if (val) {
    timeoutRef = +setTimeout(() => {
      isError.value = false;
    }, 3000);
  }

  onCleanup(() => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
  });
});

watch(isSuccess, (val, oldVal, onCleanup) => {
  let timeoutRef: number;
  if (val) {
    timeoutRef = +setTimeout(() => {
      isSuccess.value = false;
    }, 3000);
  }

  onCleanup(() => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
  });
});
</script>
