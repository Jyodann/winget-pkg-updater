import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import pagefind from "lume/plugins/pagefind.ts";
import basePath from "lume/plugins/base_path.ts";

const site = lume({
  location: new URL("https://jyodann.github.io/winget-pkg-updater/"),
});
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

site.use(basePath());

export default site;
