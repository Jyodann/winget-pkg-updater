export default function* ({ search, paginate }) {
  const posts = search.pages("Package");

  console.log(posts);
}
