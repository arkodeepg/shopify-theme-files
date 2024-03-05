function Footer(container) {  
  var sectionId = container.getAttribute('data-section-id');
  var m = container.getAttribute('data-multi');
  theme.multiFoot = m;
  if ((theme.multiHead == 'false') && (theme.multiFoot == 'true')) {
    Multi();
  }
}
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'footer' && !sectionContainer.classList.contains('ignore')){
    Footer(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})