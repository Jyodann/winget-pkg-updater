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
