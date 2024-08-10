import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import pagefind from "lume/plugins/pagefind.ts";
import relativeUrls from "lume/plugins/relative_urls.ts";
const site = lume();

site.use(tailwindcss(/* Options */));
site.use(postcss());
site.use(
  pagefind({
    indexing: {
      rootSelector: "html",
      verbose: false,
    },
  })
);

site.use(relativeUrls());

export default site;
