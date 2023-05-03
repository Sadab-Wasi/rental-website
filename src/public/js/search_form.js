function search_keyword() {
  const keyword = $("#input_search").val();
  window.location = `/shop/?search=${keyword}`;
}

if (search) {
  const isKeywordSearch = search.split("&")[0].split("=")[0] == "search";

  if (isKeywordSearch) {
    const search_keyword = search.split("&")[0].split("=")[1].replace(/%20/g, " ");
    $("#input_search").val(search_keyword);

    $("#all_products form").filter(function () {
      const title = $("div > div:nth-child(2)", this);
      const isMatch = title.text().toLowerCase().indexOf(search_keyword) > -1;
      $(this).toggle(isMatch);
    });
  }
}
