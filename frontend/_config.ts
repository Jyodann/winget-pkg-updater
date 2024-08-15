import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import pagefind from "lume/plugins/pagefind.ts";
import basePath from "lume/plugins/base_path.ts";
import metas from "lume/plugins/metas.ts";
import sitemap from "lume/plugins/sitemap.ts";
import robots from "lume/plugins/robots.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import terser from "lume/plugins/terser.ts";
const site = lume({});
site.use(
  tailwindcss({
    options: {
      theme: {
        extend: {
          fontFamily: {
            outfit: ["Outfit", "sans-serif"],
          },
          colors: {
            "science-blue": {
              "50": "#f1f7fe",
              "100": "#e2effc",
              "200": "#bedef9",
              "300": "#85c2f4",
              "400": "#44a3ec",
              "500": "#1c88db",
              "600": "#0f6cbd",
              "700": "#0d5597",
              "800": "#0f497d",
              "900": "#123d68",
              "950": "#0c2745",
            },
          },
        },
      },
    },
  })
);
site.use(postcss());
site.use(
  pagefind({
    indexing: {
      rootSelector: "html",
      verbose: false,
    },
    ui: false,
  })
);

if (Deno.env.get("ENV_TYPE") == "PROD") {
  Deno.env.set(
    "app_list_statement",
    `
    	SELECT Identifier, Publisher FROM Applications
    	GROUP BY Identifier
    `
  );
} else {
  Deno.env.set(
    "app_list_statement",
    `
    	SELECT Identifier, Publisher FROM Applications
    	GROUP BY Identifier
      HAVING Identifier LIKE '%firefox%' OR Identifier LIKE '%bitwarden%'
    `
  );
}

console.log("ENV: " + Deno.env.get("ENV_TYPE"));

site.use(basePath());
site.use(metas(/* Options */));
site.use(sitemap(/* Options */));
site.use(robots(/* Options */));

site.use(terser(/* Options */));
site.use(
  minifyHTML({
    extensions: [".css", ".html"],
  })
);
export default site;
