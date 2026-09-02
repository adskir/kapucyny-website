module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/_redirects");

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
