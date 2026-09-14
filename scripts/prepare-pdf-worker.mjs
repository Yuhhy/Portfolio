import { copyFile, mkdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { version } = JSON.parse(await readFile(require.resolve("pdfjs-dist/package.json"), "utf8"));
const directory = new URL("../public/pdfjs/", import.meta.url);
await mkdir(directory, { recursive: true });
await copyFile(
  require.resolve("pdfjs-dist/build/pdf.worker.min.mjs"),
  new URL(`pdf.worker-${version}.min.mjs`, directory),
);
