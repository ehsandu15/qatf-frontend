import { createDirectus, readItems, rest, withToken } from "@directus/sdk";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const directusAccessToken = useRuntimeConfig().public.directusAccessToken;
  const createDirectusUrl = useRuntimeConfig().public.directusUrl;

  try {
    const client = createDirectus(createDirectusUrl).with(rest());
    const toPage = computed(() =>
      to.path.replace(`/${to.path.split("/")[1]}`, "")
    );
    const data = await client.request(
      withToken(
        directusAccessToken,
        readItems("published_pages", {
          fields: ["id", "published", "page.path"],
        })
      )
    );

    const foundedPage = computed(() =>
      data.filter((item) => item.page.path === toPage.value)
    );

    if (foundedPage.value.length > 0) {
      if (foundedPage.value[0].published) {
        return;
      } else {
        return abortNavigation({ statusCode: 403 });
      }
    } else {
      console.error("Page not found in directus published_pages");
    }
  } catch (error) {
    console.error("error :", error);
  }
});
