function Slider(container) {
  var sectionId = container.getAttribute('data-section-id');
  var Carousel = document.getElementById('glider-carousel-' + sectionId);
  if (Carousel) {
    Sliders(container);
  }
  if (theme.settings.cart) {
    Cart(container);
  }
  Swatches(container);
}

document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  if(sectionType === 'carousel'){
    Slider(sectionContainer);
  }
})

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'carousel' && !sectionContainer.classList.contains('ignore')){
    Slider(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})