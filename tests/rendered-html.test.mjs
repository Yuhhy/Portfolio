import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function visibleText(html) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:#x27|apos);/gi, "’")
    .replace(/\s+/g, " ")
    .trim();
}

test("server-renders the Nguyen Tan Huy portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const text = visibleText(html);
  assert.match(html, /<title>Nguyen Tan Huy — Portfolio<\/title>/i);
  assert.match(text, /Nguyen Tan Huy/i);
  assert.match(text, /Featured projects/i);
  assert.match(text, /Recent thoughts/i);
  assert.match(text, /Visual playground/i);
  assert.match(text, /Let’s build what’s next\./i);
  assert.doesNotMatch(
    html,
    /Building your site|Your site is taking shape|react-loading-skeleton/i,
  );
});
