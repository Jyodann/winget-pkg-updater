async function search_item(search_value, pagefind, tparent_div, template) {
  const search_res = await pagefind.debouncedSearch(search_value, {
    sort: {
      weight: "desc",
    },
  });

  if (search_res === null) {
    // a more recent search call has been made, nothing to do
  } else {
    tparent_div.replaceChildren();
    const results = search_res.results.slice(0, 10);
    for (const res of results) {
      const clone = template.content.cloneNode(true);

      const div = clone.querySelector("#app_parent");
      const extra_info = clone.querySelector("#app_extra_info");
      const title = clone.querySelector("#app_name");
      const publisher = clone.querySelector("#app_publisher");
      const archs = clone.querySelector("#app_archs");
      const latest_archs = clone.querySelector("#app_latest_archs");
      const data = await res.data();
      const meta_data = data.meta;

      title.textContent = meta_data.title;
      title.href = data.url;
      tparent_div.appendChild(clone);

      div.addEventListener("click", (ev) => {
        window.location.href = data.url;
      });
      let style = "bg-red-800";
      if ("Architectures" in meta_data) {
        const latest_arch_info = meta_data["Latest_Version_Architectures"];
        publisher.textContent = meta_data["Publisher"];
        archs.textContent = meta_data["Architectures"];
        latest_archs.textContent = latest_arch_info;

        if (latest_arch_info.includes("neutral")) {
          style = "bg-yellow-700";
        }

        if (
          latest_arch_info.includes("arm") ||
          latest_arch_info.includes("arm64")
        ) {
          style = "bg-green-800";
        }
      } else {
        style = "bg-slate-800";
        extra_info.classList.add("hidden");
        title.textContent = `${meta_data["Publisher"]} (${meta_data["publisherIdentifer"]})`;
        publisher.textContent = "Publisher";
      }

      div.classList.add(style);
    }
  }
}
async function init() {
  if (!("content" in document.createElement("template"))) {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  const tparent_div = document.querySelector("#search_results");
  const template = document.querySelector("#result_row");
  const pagefind = await import("/pagefind/pagefind.js");

  pagefind.init();
  const filters = await pagefind.filters();

  const search = document.getElementById("search");

  if (query !== null) {
    search.value = query;
  }

  if (search.value !== "") {
    const search_value = search.value;
    search_item(search_value, pagefind, tparent_div, template);
  }

  search.addEventListener("input", async (event) => {
    const search_value = search.value;
    search_item(search_value, pagefind, tparent_div, template);
  });
}

init();
