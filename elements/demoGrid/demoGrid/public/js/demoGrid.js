// Script to initialize Slick Slider in Visual Composer editor
// and on View Page, this file is minified and located in the dist folder.
// Minified version of this file is included in settings.json under metaPublicJs property.

(function ($) {
  function updateProfileVisibility(activeFilters) {
    console.log("activeFilters", activeFilters);

    $(".profile").each(function () {
      const tags = $(this).data("tags");
      console.log("tags", tags);
      const tagsArray = tags.split(", ");
      if (activeFilters.length === 0) {
        $(this).show();
        return;
      }
      const hideProfile = !activeFilters.every((tag) =>
        tagsArray.includes(tag)
      );

      $(this).toggle(!hideProfile);
    });
  }
  function initialize() {
    console.log("js loaded");
    const clearFiltersBtn = $(".clear-filters-btn");
    const activeFilters = [];
    clearFiltersBtn.on("click", function () {
      activeFilters.length = 0;
      console.log(activeFilters);
      $(".filter-checkbox").prop("checked", false);
      updateProfileVisibility(activeFilters);
    });

    $(".filter-checkbox").on("click", function () {
      const itemId = $(this).data("item-id");
      const index = activeFilters.indexOf(itemId);

      if (index > -1) {
        activeFilters.splice(index, 1); // Remove item from array
      } else {
        activeFilters.push(itemId); // Add item to array
      }

      console.log(activeFilters);
      updateProfileVisibility(activeFilters);
    });
  }
  // window.vcv.on('ready', function () {}) is a global event listener
  // it is triggered each time element is added to the page or gets edited (in VC editor)
  window.vcv.on("ready", () => {
    initialize();
  });
})(window.jQuery);
