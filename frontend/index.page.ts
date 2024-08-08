import { Database } from "jsr:@db/sqlite@0.11";
const db = new Database("winget-pkg-app.db");

export default function* () {
  const applications = db
    .prepare(
      `
	SELECT Identifier FROM Applications
	GROUP BY Identifier
	HAVING Identifier LIKE '%firefox%'
	`
    )
    .all()!;

  for (const app of applications) {
    const identifier = app["Identifier"];
    const index = identifier.indexOf(".");

    const identifier_pub_name = identifier.slice(0, index);
    const identifier_app_name = identifier.slice(index + 1);
    const app_info_statement = db.prepare(
      `
SELECT Name, Identifier, Version, Publisher, Licence, ShortDescription, group_concat(Architecture) AS AVAILABLE_ARCHS FROM Applications
WHERE Identifier = ?
GROUP BY Version
ORDER BY Version;
	`
    );

    yield {
      url: `/pkg/${identifier_pub_name}/${identifier_app_name}`,
      content: JSON.stringify(app_info_statement.all(identifier), null, 4),
    };
  }
}
