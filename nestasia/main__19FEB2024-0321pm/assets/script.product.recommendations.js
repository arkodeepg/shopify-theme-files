function Recommendations(container) {
  var sectionId = container.getAttribute('data-section-id');    
  var productId = container.getAttribute('data-product-id');        
  var u = container.dataset.address;
  var pRS = document.querySelector('.product-recommendations');
  if (pRS === null) {        
    document.getElementById(container.dataset.id).classList.add('hidden');
    return; 
  }
  fetch(u)
  .then(function(response) {
    return response.text();
  })
  .then(function(h) {
    container.innerHTML = h;
    container.innerHTML = container.querySelector('.product-recommendations').innerHTML;
    document.getElementById(container.dataset.id).querySelector('.loading').remove();
    if (theme.settings.quickView) {
      Quick();
    };
    if (theme.settings.compare) {
      CompareProducts();
    };
    var Carousel = document.getElementById('glider-carousel-' + sectionId);
    if (Carousel) {
      Sliders(container);
    }
    if (theme.settings.cart) {
      Cart(container);
    }
    Swatches(container);
  }).catch(function (err) {
    document.getElementById(container.dataset.id).classList.add('hidden');
    console.log('!: ' + err);
  });
}

document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  if(sectionType === 'product_recommendations'){
    Recommendations(sectionContainer);
  }
})

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'product_recommendations' && !sectionContainer.classList.contains('ignore')){
    Recommendations(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})