import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import pagefind from "lume/plugins/pagefind.ts";
import basePath from "lume/plugins/base_path.ts";

const site = lume({
  location: new URL("https://jyodann.github.io/winget-pkg-updater/"),
});
site.use(
  tailwindcss({
    options: {
      theme: {
        extend: {
          fontFamily: {
            outfit: ["Outfit", "sans-serif"],
          },
          colors: {
            jacarta: {
              "50": "#edf0ff",
              "100": "#dfe2ff",
              "200": "#c5caff",
              "300": "#a2a7ff",
              "400": "#7f7cfd",
              "500": "#6c5ef6",
              "600": "#5e40eb",
              "700": "#5032d0",
              "800": "#412ca7",
              "900": "#2e236c",
              "950": "#22194d",
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
    ui: {
      autofocus: true,
      showEmptyFilters: false,
    },
  })
);

if (Deno.env.get("ENV_TYPE") == "PROD") {
  Deno.env.set(
    "app_list_statement",
    `
    	SELECT Identifier FROM Applications
    	GROUP BY Identifier
    `
  );
} else {
  Deno.env.set(
    "app_list_statement",
    `
    	SELECT Identifier FROM Applications
    	GROUP BY Identifier
      HAVING Identifier LIKE '%firefox%' OR Identifier LIKE '%bitwarden%'
    `
  );
}

console.log("ENV: " + Deno.env.get("ENV_TYPE"));

site.use(basePath());

export default site;
