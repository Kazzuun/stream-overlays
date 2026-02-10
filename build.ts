#!/usr/bin/env bun
import path from "path";
import { existsSync } from "node:fs";
import Bun from "bun";

// 1. Get all the necessary file paths
const pkgName = Bun.argv[2];
if (!pkgName) {
    console.error("Usage: bun build.js <package-name>");
    process.exit(1);
}

const pkgDir = path.join("overlays", pkgName);
if (!existsSync(pkgDir)) {
    console.error(`Directory not found: ${pkgDir}`);
    process.exit(1);
}

const packagePath = path.join(pkgDir, "package.json");
const configPath = path.join(pkgDir, "config.json");
const htmlPath = path.join(pkgDir, "overlay.html");
const cssPath = path.join(pkgDir, "overlay.css");
const tsPath = path.join(pkgDir, "overlay.ts");

if (
    !existsSync(packagePath) ||
    !existsSync(configPath) ||
    !existsSync(htmlPath) ||
    !existsSync(cssPath) ||
    !existsSync(tsPath)
) {
    console.error(
        "An overlay must include the following files: package.json, config.json, overlay.html, overlay.css, and overlay.ts",
    );
    process.exit(1);
}

// 2. Build the typescript
let buildOutput;
try {
    buildOutput = await Bun.build({
        entrypoints: [tsPath],
        target: "browser",
        format: "esm",
        minify: false,
    });
} catch (err) {
    console.error("Bundling failed:", err);
    process.exit(1);
}

if (!buildOutput.success) {
    console.error("Bundler returned errors:", buildOutput.logs);
    process.exit(1);
}

const jsArtifact = buildOutput.outputs.find((o) => o.kind === "entry-point");
if (!jsArtifact) {
    console.error("No bundled output was generated.");
    process.exit(1);
}

// 3. Read the contents of the files
let [packageContent, configContent, htmlContent, cssContent, jsContent] =
    await Promise.all([
        Bun.file(packagePath).json(),
        Bun.file(configPath).json(),
        Bun.file(htmlPath).text(),
        Bun.file(cssPath).text(),
        jsArtifact.text(),
    ]);

// Remove all exports
jsContent = jsContent.replace(/export\s\{[\s\S]*\};/g, "");

// Format Mixitup placeholder values correctly
jsContent = jsContent.replace(/\{\s*([A-Za-z0-9_]+)\s*\}/g, "{$1}");

// 4. Save the overlay
const version = `v${packageContent.version}`;
configContent.Name = `${configContent.Name} ${version}`;
configContent.Item.HTML = htmlContent;
configContent.Item.CSS = cssContent;
configContent.Item.Javascript = jsContent;

const outputJson = JSON.stringify(configContent);
const outFile = path.join("out", pkgName, `${version}-${pkgName}.miuoverlay`);

await Bun.write(outFile, outputJson);
console.log(`Built and wrote overlay to ${outFile}`);
