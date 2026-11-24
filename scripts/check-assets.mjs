import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const found = new Set();
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await inspect(file);
    else if (/\.(?:[cm]?js|tsx?|css)$/.test(file)) {
      const text = await readFile(file, "utf8");
      for (const match of text.matchAll(/["'`](\/assets\/[^"'`\s)]+)["'`]/g)) found.add(match[1]);
    }
  }
}
await inspect(path.join(root, "src"));
for (const asset of found) await access(path.join(root, "public", asset));
for (const file of ["src/app/page.tsx", "src/app/work/[slug]/page.tsx", "src/app/api/contact/route.ts", "package-lock.json", "public/no-script.css"]) await access(path.join(root, file));
console.log(`Verified ${found.size} local asset references and required application files.`);
