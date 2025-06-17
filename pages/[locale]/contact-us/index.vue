<template>
  <section class="app-container my-16 min-h-[60dvh]">
    <span class="w-full flex flex-col gap-2 items-start relative">
      <p
        class="relative w-fit text-secondary text-base md:text-xs font-bold text-start before:absolute before:bottom-0 before:left-0 before:w-full before:rounded-full before:h-1/2 before:bg-gradient-to-t px-2 py-1 before:from-secondary/60 isolate"
      >
        {{ contactUs.headingTitle }}
      </p>
      <h3
        class="text-[44px] md:text-[64px] font-semibold text-black leading-tight lg:max-w-4xl"
      >
        {{ contactUs.description }}
      </h3>
      <ul
        v-if="socialMedia?.socialMedia"
        class="flex md:flex-col gap-4 md:absolute max-md:self-center max-md:mt-6 rtl:left-2 ltr:right-2"
      >
        <li v-for="platform of socialMedia.socialMedia" :key="platform.id">
          <NuxtLink :href="platform.platformUrl" target="_blank">
            <nuxt-img
              provider="directus"
              :src="platform.icon"
              :alt="`platform-${platform.id}`"
              class="size-10"
            />
          </NuxtLink>
        </li>
      </ul>
    </span>
    <form
      class="w-full flex flex-wrap gap-5 mt-14"
      @submit.prevent="handleSubmit"
    >
      <div
        class="w-full sm:w-[calc(50%-1.5rem)] flex items-center justify-between gap-5 overflow-hidden flex-wrap"
      >
        <div class="w-full flex flex-col gap-2">
          <label
            for="company-name"
            class="text-[14px] font-semibold capitalize"
            >{{ contactUs.companyNameLabel }}</label
          >
          <input
            id="company-name"
            v-model="form.companyName"
            type="text"
            name="company-name"
            required
            class="border border-gray-300 rounded-lg p-2"
            @blur="touched.companyName = true"
          />
          <span
            v-if="touched.companyName && !form.companyName"
            class="text-red-500 text-xs"
            >{{
              contactUs.companyNameValidationMessage ||
              "يجب أن يكون اسم الشركة أو المؤسسة مكونًا من حرفًا واحدًا على الأقل"
            }}</span
          >
        </div>
        <div class="w-full flex flex-col gap-2">
          <label for="email" class="text-[14px] font-semibold capitalize">
            {{ contactUs.emailLabel }}
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            name="email"
            required
            class="border border-gray-300 rounded-lg p-2"
            @blur="touched.email = true"
          />
          <span
            v-if="touched.email && !form.email"
            class="text-red-500 text-xs"
            >{{
              contactUs.emailValidationMessage ||
              "يجب أن يكون عنوان بريد إلكتروني صالحًا"
            }}</span
          >
        </div>
        <div class="w-full flex flex-col gap-2">
          <label
            for="phone-number"
            class="text-[14px] font-semibold capitalize"
          >
            {{ contactUs.phoneLabel }}
          </label>
          <phone-input
            id="phone-number"
            v-model:country-code="countryCode"
            v-model:phone-number="phoneNumber"
            name="phone-number"
            select-element-id="country-code"
            select-element-name="country-code"
            required
            class="w-full"
            @blur="touched.phone = true"
          />
          <span
            v-if="touched.phone && !phoneNumber"
            class="text-red-500 text-xs"
            >{{
              contactUs.phoneValidationMessage ||
              "يجب أن يكون رقم الهاتف مكونًا من 10 أرقام"
            }}</span
          >
        </div>
      </div>
      <div class="w-full sm:w-[calc(50%-1.5rem)] flex flex-col gap-2">
        <label for="message" class="text-[14px] font-semibold capitalize">{{
          contactUs.messageLabel
        }}</label>
        <textarea
          id="message"
          v-model="form.message"
          name="message"
          class="border border-gray-300 rounded-lg p-2"
          required
          rows="9"
          @blur="touched.message = true"
        />
        <span
          v-if="touched.message && !form.message"
          class="text-red-500 text-xs"
          >{{
            contactUs.messageValidationMessage ||
            "يجب أن يكون الرسالة مكونًا من حرفًا واحدًا على الأقل"
          }}</span
        >
      </div>
      <div class="w-full flex flex-col gap-4">
        <Turnstile
          theme="auto"
          appearance="execute"
          :site-key="useRuntimeConfig().public.turnstileSiteKey"
          :model-value="turnsiteToken"
          @error="onTurnsiteError"
          @update:model-value="(event) => (turnsiteToken = event)"
        />
        <button
          v-if="!isSuccess && !isError"
          type="submit"
          class="w-full flex items-center justify-center sm:w-[calc(50%-1.5rem)] text-white px-4 py-2 rounded-lg mt-4 bg-black transition-colors hover:bg-secondary disabled:bg-slate-500"
          :disabled="
            !isVerifiedTurnstile ||
            isLoading ||
            !phoneNumber ||
            !form.email ||
            !form.companyName ||
            !form.message
          "
        >
          <span
            v-if="isLoading"
            class="size-8 rounded-full border-4 border-slate-200 border-r-transparent animate-spin flex"
          />
          <p v-else>{{ contactUs.submitButton || "ارسال" }}</p>
        </button>
      </div>
      <button
        v-if="isSuccess"
        type="button"
        disabled
        class="w-full flex items-center justify-center gap-2.5 sm:w-[calc(50%-1.5rem)] text-white px-4 py-2 rounded-lg mt-4 bg-emerald-700"
      >
        <p class="text-center">
          {{ contactUs.formSendSuccessMessage || "تم ارسال الطلب بنجاح" }}
        </p>
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
          class="lucide lucide-check-icon lucide-check"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </button>
      <button
        v-if="isError"
        type="button"
        disabled
        class="w-full flex items-center justify-center gap-2.5 sm:w-[calc(50%-1.5rem)] text-white px-4 py-2 rounded-lg mt-4 bg-red-700"
      >
        <p class="text-center max-w-full truncate overflow-hidden">
          {{
            errorMsg ||
            contactUs.formSendErrorMessage ||
            "لقد حدث مشكلة ما , برجاء المحاولة لاحقا"
          }}
        </p>
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
          class="lucide lucide-circle-alert-icon lucide-circle-alert"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      </button>
    </form>
  </section>
</template>
<script setup lang="ts">
import { NuxtLink } from "#components";
import { QUERY_KEYS } from "~/constants/query-keys";
import Turnstile from "vue-turnstile";

const form = reactive({
  companyName: "",
  email: "",
  message: "",
});
const touched = reactive({
  companyName: false,
  email: false,
  phone: false,
  message: false,
});
const countryCode = shallowRef("+966");
const phoneNumber = shallowRef("");
const isLoading = ref<boolean>(false);
const isError = ref<boolean>(false);
const isSuccess = ref<boolean>(false);
const errorMsg = ref<string | null>(null);
const isVerifiedTurnstile = shallowRef<boolean>(false);
const turnsiteToken = shallowRef<string>("");
const { currentLocale, getLocaleObject } = useI18n();
const { $directus } = useNuxtApp();
const { data } = await useAsyncData(QUERY_KEYS.pages.contactUs, () =>
  $directus.query(
    `
      query {
        contactUs {
          id
          translations {
            id
            languages_id
            headingTitle
            description
            phoneLabel
            companyNameLabel
            emailLabel
            messageLabel
            submitButton
            companyNameValidationMessage
            emailValidationMessage
            phoneValidationMessage
            messageValidationMessage
            formSendSuccessMessage
            formSendErrorMessage
          }
        }
      }
    `
  )
);
const { data: socialMedia } = await useAsyncData(
  QUERY_KEYS.collections.socialMedia,
  () =>
    $directus.query(
      `
      query {
        socialMedia {
          id
          icon
          platformUrl
        }
      }
    `
    )
);

const contactUs = computed(() => ({
  ...data.value?.contactUs,
  ...data?.value?.contactUs.translations.find(
    (translation: { languages_id: number }) =>
      translation.languages_id.toString() ===
      getLocaleObject(currentLocale.value).id
  ),
}));

watch([isError], () => {
  setTimeout(() => {
    isError.value = false;
    errorMsg.value = null;
  }, 5000);
});

watch([isSuccess], () => {
  setTimeout(() => {
    isSuccess.value = false;
  }, 5000);
});

watch([turnsiteToken], async () => {
  if (turnsiteToken.value !== "") {
    await $fetch("/api/verify-turnstile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: turnsiteToken.value }),
      onResponse: (res) => {
        if (res.response.ok) {
          const isVerified: boolean = res.response._data;
          isVerifiedTurnstile.value = isVerified;
        } else {
          isVerifiedTurnstile.value = false;
        }
      },
    });
  }
});
const onTurnsiteError = (ev) => {
  console.error("captcha checking error", ev);
};

const handleSubmit = async () => {
  touched.companyName = false;
  touched.email = false;
  touched.phone = false;
  touched.message = false;
  try {
    await $fetch<{
      data: {
        error: boolean;
        message: string;
        stack: string;
        statusMessage: string;
        statusCode: number;
        url: string;
      };
    }>("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        phone: `${countryCode.value}${phoneNumber.value}`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    isSuccess.value = true;
    isError.value = false;
    isLoading.value = false;
    errorMsg.value = null;
    form.companyName = "";
    form.email = "";
    form.message = "";
    countryCode.value = "+966";
    phoneNumber.value = "";
  } catch (error: unknown) {
    isSuccess.value = false;
    isError.value = true;
    isLoading.value = false;
    if (import.meta.dev) {
      errorMsg.value = error instanceof Error ? error.message : "unknown error";
      console.error(
        "submitForm error",
        error instanceof Error ? error.message : "__--__"
      );
      console.error("submit form mutation error", errorMsg);
    } else {
      errorMsg.value = "submit error please try again later";
      console.error("submitForm error ", errorMsg);
    }
  }
};
</script>
