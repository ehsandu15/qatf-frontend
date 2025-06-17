export default defineEventHandler(async (event) => {
  const body = await readBody<{ token: string }>(event);

  try {
    if (event.method === "POST") {
      const res = await verifyCaptcha(body.token);
      return res;
    }
    return createError({
      status: 405,
      message: "method is not allowed",
      statusMessage: "method is not allowed",
    });
  } catch (error) {
    return createError({
      status: 400,
      statusMessage:
        error instanceof Error ? error.message : "something went wrong",
      message: error instanceof Error ? error.message : "something went wrong",
    });
  }
});
const verifyCaptcha = async (token: string) => {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: useRuntimeConfig().turnstile.secretKey,
        response: token,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error("can't able to verify token , " + response.statusText);
  }
  return data.success;
};
