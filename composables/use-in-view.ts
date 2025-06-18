import { ref, onMounted, onUnmounted, watch, type Ref } from "vue";

type InViewOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export function useInView(
  target: Ref<HTMLElement | null>,
  options: InViewOptions = {}
) {
  const isInView = ref(false);
  let observer: IntersectionObserver | null = null;

  const cleanup = () => {
    if (observer && target.value) {
      observer.unobserve(target.value);
      observer.disconnect();
      observer = null;
    }
  };

  const createObserver = () => {
    if (!target.value || typeof IntersectionObserver === "undefined") return;

    observer = new IntersectionObserver(
      ([entry]) => {
        isInView.value = entry.isIntersecting;
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || "0px",
        threshold: options.threshold ?? 0.1,
      }
    );

    observer.observe(target.value);
  };
  watch(
    target,
    (el, _, onCleanup) => {
      cleanup();
      if (el) createObserver();
      onCleanup(() => cleanup());
    },
    { immediate: true }
  );

  onUnmounted(() => {
    cleanup();
  });

  return { isInView };
}
