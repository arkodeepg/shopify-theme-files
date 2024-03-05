theme.NotFound = (function() {
  function NotFound(container) {
    var sectionId = container.getAttribute('data-section-id');
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    if (Carousel) {
      Sliders(container);
    }
    Swatches(container);
    if (theme.settings.cart) {
      Cart(container);
    }
    NotFound.prototype.onSelect = function(ev) {
      if (theme.settings.quickView) {
        Quick();
      }
      if (theme.settings.compare) {
        CompareProducts();
      };
      if (theme.settings.cart) {
        Cart(container);
      }
    }
  }
  return NotFound;
})();