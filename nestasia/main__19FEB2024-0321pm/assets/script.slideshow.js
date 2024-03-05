function Slideshow(container) {
  var sectionId = container.getAttribute('data-section-id');
  var type = container.getAttribute('data-slideshow-type');
  var Carousel = document.getElementById('glider-carousel-' + sectionId);
  if (Carousel) {
    var next = document.getElementById('glider-button-next-' + sectionId);
    var prev = document.getElementById('glider-button-prev-' + sectionId);
    var dots = document.getElementById('glider-dots-' + sectionId);
    var glider = new Glider(Carousel, {
      arrows: {
        prev: prev,
        next: next
      },
      dots: dots,
      draggable: true,
      rewind: true,
      scrollLock: true,
      scrollLockDelay:0,
      skipTrack: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });      
    var image = {
      dimensions:function (e) {
        var CSm = Carousel.querySelector('.glider-slide.visible img.mobile-image');
        var CSd = Carousel.querySelector('.glider-slide.visible img.desktop-image');
        if (CSm && CSd) {
          var iW = theme.width;
          var mMW = theme.breakpoint_margin;
          if (iW <= mMW) {
            var CarouselSlide = CSm;
          } else {
            var CarouselSlide = CSd;
          }
        } else {
          var CarouselSlide = Carousel.querySelector('.glider-slide.visible img');
        }
        if ((type == 'image') && (CarouselSlide)) {
          var CarouselWidth = CarouselSlide.offsetWidth;
          var newHeight = CarouselSlide.getAttribute('data-aspectratio');
          Carousel.querySelector('.glider-track').style.height = CarouselWidth/newHeight + 'px';
        } else {
          var CarouselSlide = Carousel.querySelector('.glider-slide.visible .content-height-' + sectionId);
          if (CarouselSlide) {
            var newHeight = CarouselSlide.offsetHeight;
            Carousel.querySelector('.glider-track').style.height = newHeight + 'px';
          }
        }
      }
    };
    if (glider) {
      Carousel.querySelector('.glider-track.slideshow').classList.add('loaded');        
      var CarouselSlide = Carousel.querySelector('.glider-slide.visible img');
      if ((type == 'image') && (CarouselSlide)) {
        image.dimensions();
      } else {
        if(theme.css){
          if (theme.cssLoaded) {
            image.dimensions();
          } else {
            theme.css.addEventListener('load', function () {
              image.dimensions();
            });
          }
        }
      }
    }
    Carousel.addEventListener('glider-slide-visible', function(ev){
      image.dimensions();
      Carousel.querySelector('.glider-slide.visible').classList.remove('hidden');
      if(!Shopify.designMode && (document.readyState == 'complete') && (Carousel.getAttribute('data-glider-autorotate') == 'false')) {
        var s = Carousel.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
      }
    });      
    if (Carousel.getAttribute('data-glider-autorotate') == 'true') {      
      let a = Carousel.getAttribute('data-glider-autoplay');
      function n() {
        glider.scrollItem('next');
      }
      theme.sI = setInterval(n, a);            
      function clear() {
        clearInterval(theme.sI);
      }
      next.onclick = clear;
      prev.onclick = clear;
      next.ontouchstart = clear;
      prev.ontouchstart = clear;
      Carousel.onclick = clear;
      Carousel.ontouchmove = clear;
      if (Shopify.designMode) {
        Carousel.addEventListener('shopify:block:select', function(e) {
          clear();
        });
      }      
    }
    var resizeTimer;
    window.addEventListener('resize', function(e) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        image.dimensions();
      }, 250);
    });
  }
}

document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  if(sectionType === 'slideshow'){
    Slideshow(sectionContainer);
  }
})

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'slideshow' && !sectionContainer.classList.contains('ignore')){
    Slideshow(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})