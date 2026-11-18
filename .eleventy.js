const yaml = require("js-yaml");
const eleventyImage = require("@11ty/eleventy-img");
const fs = require("fs");
const path = require("path");

async function imageShortcode(src, alt, sizes = "(min-width: 800px) 800px, 100vw") {
  if (!src) return "";
  let inputPath = src.startsWith("/") ? "src" + src : src;

  if (!fs.existsSync(inputPath)) {
    // Photo not uploaded yet — skip silently instead of crashing the whole build
    console.warn(`[image shortcode] Файл не знойдзены, прапускаю: ${inputPath}`);
    return "";
  }

  let metadata = await eleventyImage(inputPath, {
    widths: [400, 800, 1200, 1600], // capped at 1600 — no point shipping multi-MB originals from phone/DSLR photos
    formats: ["webp", "jpeg"],
    outputDir: "./.cache/img/",
    urlPath: "/images/uploads/optimized/",
    cacheOptions: {
      duration: "*", // never expire — files are content-hashed, safe to keep forever
      directory: "./.cache/eleventy-img-cache/",
    },
  });

  let imageAttributes = {
    alt: alt || "",
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return eleventyImage.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml, yaml", (contents) => yaml.load(contents));
  eleventyConfig.addAsyncShortcode("image", imageShortcode);

  // NOTE: we deliberately do NOT use addPassthroughCopy for ./.cache/img here.
  // Passthrough copies are captured at the START of the build, but the image
  // shortcode writes into .cache/img WHILE templates are rendering — so on a
  // build where a new photo appears for the first time, the copy step runs
  // before the file exists and the image silently goes missing from _site.
  // Copying after the whole build (eleventy.after) guarantees every image
  // generated during this run, old or brand new, actually ends up on the site.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const src = "./.cache/img";
    const dest = path.join(dir.output, "images/uploads/optimized");
    if (fs.existsSync(src)) {
      fs.mkdirSync(dest, { recursive: true });
      for (const file of fs.readdirSync(src)) {
        fs.copyFileSync(path.join(src, file), path.join(dest, file));
      }
    }
  });

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/.htaccess"); // рэдырэкты для hoster.by (Apache/LiteSpeed)

  eleventyConfig.addCollection("lokacyi", (api) =>
    api.getFilteredByGlob("src/lokacyi/*.md").sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  eleventyConfig.addCollection("novosti", (api) =>
    api.getFilteredByGlob("src/novosti/*.md").sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );

  eleventyConfig.addCollection("bibliyateka", (api) =>
    api.getFilteredByGlob("src/bibliyateka/*.md")
  );

  eleventyConfig.addFilter("dateBy", (dateObj) => {
    const d = new Date(dateObj);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
  });

  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  // ── SEO ──
  // Кароткае апісанне са зместу старонкі (калі няма поля description): без HTML, да ~155 сімвалаў па мяжы слова
  eleventyConfig.addFilter("seoExcerpt", (html, max = 155) => {
    if (!html) return "";
    let text = String(html)
      // без загалоўкаў, «хлебных крошак» і шапкі старонкі — толькі асноўны тэкст
      .replace(/<section class="page-hero"[\s\S]*?<\/section>/gi, " ")
      .replace(/<(script|style|form|h1|h2|h3|nav|figcaption)[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<div class="breadcrumb">[\s\S]*?<\/div>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length <= max) return text;
    let cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    if (lastSpace > max * 0.6) cut = cut.slice(0, lastSpace);
    return cut.replace(/[\s,.;:—–-]+$/, "") + "…";
  });

  // Абсалютны адрас для canonical, Open Graph і sitemap
  eleventyConfig.addFilter("absUrl", (url, base) => {
    if (!url) return "";
    if (/^https?:\/\//.test(url)) return url;
    return String(base).replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
  });

  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
