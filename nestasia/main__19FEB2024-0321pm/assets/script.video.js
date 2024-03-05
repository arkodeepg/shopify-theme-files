function Video(container) {
  var sectionId = container.getAttribute('data-section-id'),
      typ = container.getAttribute('data-type'),
      vid = container.getAttribute('data-video'),
      vP = document.getElementById('vid-' + sectionId),
      vB = document.getElementById('video-' + sectionId);  
  if(vB) {
    var vBv = vB.querySelector('video'),
        vBi = vB.querySelector('img');
    let lastKnownScrollPosition = 0;
    let ticking = false;
    if (vBv) {
      vBv.classList.add('loaded');
      var isInViewport = function (e) {
        var eT = e.getBoundingClientRect().top + window.pageYOffset,
            eB = eT + e.offsetHeight,
            vT = window.scrollY,
            vB = vT + window.innerHeight;
        return eB > vT && eT < vB;
      };
      function vidPlay() {
        if (isInViewport(vB)) {
          vBv.play();
        } else { 
          vBv.pause();
        }
      }
      setInterval(function() {
        if (theme.scrolling) {
          lastKnownScrollPosition = window.scrollY;
          if (!ticking) {
            window.requestAnimationFrame(function() {
              if (vBv) {
                vidPlay();
              };
              ticking = false;
            }.bind(this));
            ticking = true;
          }
        }
      },300);
    } else {   
      if (vBi) {
        vBi.classList.add('loaded');
      }      
    }
  }
  if(vP) {
    const m = document.querySelector('#video-' + sectionId);
    const mc = m.querySelector('.modal-container');
    const y = m.querySelector('.youtube-container');
    const aB = document.getElementById('ajaxBusy');
    if (!typ == 'youtube' || !typ == 'vimeo') return;
    if(typ == 'youtube'){
      var video = 'https://www.youtube.com/embed/' + vid + '?autoplay=1&amp;rel=0&amp;controls=0&amp;showinfo=0';
    } else if(typ == 'vimeo') {
      var video = 'https://player.vimeo.com/video/' + vid + '?autoplay=1&amp;title=0&amp;byline=0&amp;portrait=0';
    };
    vP.onclick = (e) => {      
      const i = document.createElement('iframe');
      i.setAttribute('width', '560');
      i.setAttribute('height', '315');
      i.setAttribute('src', video);
      i.setAttribute('frameborder', '0');
      i.setAttribute('allow', 'autoplay');
      i.setAttribute('allowfullscreen', '');
      try {        
        MicroModal.show('video-' + sectionId, {
          onShow: function(modal) {
            y.appendChild(i);            
            m.classList.add('loaded');
            mc.classList.add('loaded');
            aB.style.display = 'block';
            document.body.classList.add('modal-active');
          },
          onClose: function(modal) {
            setTimeout(function() {
              m.classList.remove('loaded');
              document.body.classList.remove('modal-active');
              i.remove();
            }, 250);
            mc.classList.remove('loaded');
            aB.style.display = 'none';
          }
        });
      } catch (e) {
        console.log("micromodal error: ", e);
      }
    }
  }
}

document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  if(sectionType === 'video'){
    Video(sectionContainer);
  }
})

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'video' && !sectionContainer.classList.contains('ignore')){
    Video(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})