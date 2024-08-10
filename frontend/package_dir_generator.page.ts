// https://lume.land/docs/core/render-order/

export const renderOrder = 1;

export default function* () {
  yield {
    url: `/package/index.html`,
    layout: "layouts/package_dir.vto",
    content: {
      searchContent: "publisher",
    },
  };
}
