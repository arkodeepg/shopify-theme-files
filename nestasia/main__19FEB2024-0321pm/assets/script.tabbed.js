function Tabbed(container) {
  var sectionId = container.getAttribute('data-section-id');
  var loop = container.querySelector('.product-loop[data-glider="loaded"]');
  if (loop) {
    var blockId = loop.getAttribute('data-block-id');
    var Carousel = document.getElementById('glider-carousel-' + blockId);
    if (Carousel) {
      Sliders(container);
    }
    Tabs(container);
    if (theme.settings.cart) {
      Cart(container);
    }
    Swatches(container);
  } else {
    Tabs(container); 
  }   
}

document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  if(sectionType === 'tabbed'){
    Tabbed(sectionContainer);
  }
})

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'tabbed' && !sectionContainer.classList.contains('ignore')){
    Tabbed(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})