import { Database } from "jsr:@db/sqlite@0.11";
import { coerce } from "https://deno.land/x/semver@v1.4.1/mod.ts";
const db = new Database("winget-pkg-app.db");

export default function* () {
  const statement = Deno.env.get("app_list_statement")!;
  const applications = db.prepare(statement).all()!;
  let curr_pub = "";
  for (const app of applications) {
    const identifier = app["Identifier"];
    const index = identifier.indexOf(".");

    const identifier_pub_name = identifier.slice(0, index);
    const identifier_app_name = identifier.slice(index + 1);

    if (curr_pub != identifier_pub_name) {
      curr_pub = identifier_pub_name;
      yield {
        url: `/${identifier_pub_name}/index.html`,
        layout: "layouts/package_dir.vto",
        content: {
          searchContent: `pub-${identifier_pub_name}`,
          publisherName: identifier_pub_name,
        },
        tags: ["publisher"],
        title: identifier_pub_name,
      };
    }

    const app_info_statement = db.prepare(
      `
SELECT Name, Identifier, Version, Publisher, Licence, ShortDescription, group_concat(Architecture) AS AVAILABLE_ARCHS FROM Applications
WHERE Identifier = ?
GROUP BY Version
ORDER BY Version;
	`
    );
    const app_info = app_info_statement.all(identifier);
    const all_supported_archs_across_versions = new Set();
    for (const app of app_info) {
      const ver = app["Version"];
      const parse_ver = coerce(ver);
      app["SemVer"] = parse_ver;
      app["Architecture"] = app["AVAILABLE_ARCHS"].split(",").sort();

      for (const arch of app["Architecture"]) {
        all_supported_archs_across_versions.add(arch);
      }
    }

    const sorted = app_info.sort((a, b) => {
      if (a["SemVer"] === null || b["SemVer"] === null) {
        return a["Version"] < b["Version"] ? 1 : -1;
      }
      return -a["SemVer"].compare(b["SemVer"]);
    });

    yield {
      url: `/${identifier_pub_name}/${identifier_app_name}/index.html`,
      content: sorted,
      layout: "layouts/packages.vto",
      tags: [`pub-${identifier_pub_name}`, "package"],
      title: identifier_app_name,
      all_supported_archs: all_supported_archs_across_versions,
    };
  }
}
