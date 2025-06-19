<template>
  <li
    class="flex flex-col gap-1.5"
    :class="[feature.isActive ? 'bg-primary' : `bg-white`]"
  >
    <h3
      class="text-[40px] tablet:text-5xl font-extrabold text-start"
      :class="feature.isActive ? 'text-white' : 'text-black'"
    >
      {{ `${statistic}${symbolItem}` }}
    </h3>
    <p
      class="text-base tablet:text-xl font-bold"
      :class="feature.isActive ? 'text-white' : 'text-black'"
    >
      {{ feature.description }}
    </p>
  </li>
</template>
<script setup lang="ts">
const props = defineProps<{
  feature: {
    title: string;
    description: string;
    isActive: boolean;
    id: string;
  };
  isInView: boolean;
}>();

const statistic = shallowRef<number>(0);
const symbolItem = shallowRef<string>("");
const intervalId = shallowRef<NodeJS.Timeout | null>(null);
const extractedData = computed((): [number, string] => {
  const matchedNumber = props.feature.title.match(/\d+/);
  const matchString = props.feature.title.match(/[^\d\s]+/g);

  return [
    matchedNumber ? parseInt(matchedNumber[0], 10) : 0,
    matchString ? matchString[0] : "",
  ];
});

const startIncrement = () => {
  intervalId.value = setInterval(() => {
    const [statisticValue, symbolValue] = extractedData.value;
    symbolItem.value = symbolValue;
    if (statistic.value < statisticValue) {
      statistic.value++;
    } else {
      clearInterval(intervalId.value);
    }
  }, 40);
};

onMounted(() => {
  if (props.isInView) {
    startIncrement();
  }
});

onBeforeUnmount(() => {
  if (intervalId.value) clearInterval(intervalId.value);
});

watch(
  () => [props.feature.title, props.isInView],
  ([_title, inView]) => {
    if (!inView) return;
    statistic.value = 0;
    clearInterval(intervalId.value);
    startIncrement();
  }
);
</script>
