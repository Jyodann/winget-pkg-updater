// https://lume.land/docs/core/render-order/
if (curr_pub != identifier_pub_name) {
    curr_pub = identifier_pub_name;
    yield {
      url: `/package/${identifier_pub_name}/index.html`,
      layout: "layouts/package_dir.vto",
      content: {
        searchContent: identifier_pub_name,
      },
    };
  }