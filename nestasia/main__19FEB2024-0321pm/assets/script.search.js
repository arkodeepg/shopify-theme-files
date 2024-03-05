function Search(container) {
  var sectionId = container.getAttribute('data-section-id');
  var hs = document.getElementById('search-' + sectionId);
}

document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  if(sectionType === 'search'){
    Search(sectionContainer);
  }
})

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'search' && !sectionContainer.classList.contains('ignore')){
    Search(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})

theme.Search = (function() {
  function Search(container) {
    var sectionId = container.getAttribute('data-section-id'),
        aB = document.getElementById('ajaxBusy'),
        cG = document.querySelector('#collection-grid');
    if (theme.settings.cart) {
      Cart(container);
    }
    Swatches(container);
    var ajaxLoadPage = function (url) {
      aB.style.display = 'block';
      fetch(url)
      .then(response => response.text())
      .then(data => {        
        var c = document.getElementById('collection-products'),
            f = document.getElementById('sorting');
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        var nC = htmlDocument.documentElement.querySelector('#collection-products'),
            nF = htmlDocument.documentElement.querySelector('#sorting');
        if (c) {
          c.replaceWith(nC);
        }
        if (f) {
          f.replaceWith(nF);
        }
        Wrap();
        filters.action();
        if (theme.settings.quickView) {
          Quick();
        };
        if (theme.settings.compare) {
          CompareProducts();
        };
        PriceChange();
        Swatches(container);
        if (theme.settings.cart) {
          Cart(container);
        }
        history.replaceState({
          page: url
        }, url, url);
        var s = cG.getBoundingClientRect().top + window.pageYOffset;
        window.setTimeout(function() {        
          window.scrollTo({top:s - document.selectors.sht, behavior: 'smooth'}); 
        }, 0);
        aB.style.display = 'none';
      });    
    };
    var filters = {
      action:function (e) {       
        var fA = container.querySelectorAll('li.advanced-filter a'),
            sB = container.querySelector('select.sortBy');
        fA.forEach(function(f) {
          f.onclick = function(ev){                        
            ev.preventDefault();
            var url = f.getAttribute('href');
            ajaxLoadPage(url);
          }
          f.onmouseenter = function(){
            f.classList.add('hover');
          };
          f.onmouseleave = function(){
            f.classList.remove('hover');
          };
        });
        if (sB) {
          sB.onchange = function(s){
            var u = new URL(window.location),
                params = u.searchParams;
            params.set('sort_by', this.value);
            u.search = params.toString();
            var url = u.toString();
            ajaxLoadPage(url);
          };
        };
        var iW = theme.width,
            sD = document.querySelector('#sorting details'),
            dO = document.querySelectorAll('.open-container-filter.desktop > details');
        if (sD && iW <= theme.breakpoint_margin) {
          if (sD) {
            sD.open = false;
          }
          dO.forEach(function(d) {
            d.open = false;
          });
        }
      }
    };
    function PriceChange() {
      var mnV = document.getElementById('price-min'),
          mxV = document.getElementById('price-max'),
          pIN = container.querySelectorAll('.price-input[type="number"]'),
          pIR = container.querySelectorAll('.price-input[type="range"]');
      function PriceChangeType() {
        var u = new URL(window.location),
            paramsN = u.searchParams,
            paramsX = u.searchParams;
        paramsN.set(mnV.getAttribute('data-url'), mnV.value);
        paramsX.set(mxV.getAttribute('data-url'), mxV.value);
        u.search = paramsN.toString();
        u.search = paramsX.toString();
        var url = u.toString();
        ajaxLoadPage(url);
      }
      pIN.forEach(function(p) {        
        let timeout;
        p.addEventListener('keyup', function (e) {
          if (e.keyCode != 9) {          
            clearTimeout(timeout);
            timeout = setTimeout(function () {
              PriceChangeType();
            }, 750);
          }
        });
      });      
      pIR.forEach(function(p) {
        p.addEventListener('change', PriceChangeType);
      });
    };
    PriceChange();
    filters.action();
  }
  return Search;
})(); 