function Collection(container) {
  var sectionId = container.getAttribute('data-section-id');
  var Carousel = document.getElementById('glider-carousel-' + sectionId);
  if (Carousel) {
    Sliders(container);
  }  
}

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  Collection(sectionContainer);
})

theme.Collection = (function() {
  function Collection(container) {
    var sectionId = container.getAttribute('data-section-id'),
        l = container.getAttribute('data-layout'),
        aB = document.getElementById('ajaxBusy'),
        cG = document.querySelector('#collection-grid');
    var ajaxLoadPage = function (url) {
      aB.style.display = 'block';
      fetch(url)
      .then(response => response.text())
      .then(data => {        
        var c = document.getElementById('collection-products'),
            p = document.getElementById('paginateBy'),
            bC = document.querySelector('.breadcrumbs'),
            f = document.getElementById('filters');
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        var nC = htmlDocument.documentElement.querySelector('#collection-products'),
            nP = htmlDocument.documentElement.querySelector('#paginateBy'),
            nBC = htmlDocument.documentElement.querySelector('.breadcrumbs'),
            nF = htmlDocument.documentElement.querySelector('#filters');        
        if (c) {
          c.replaceWith(nC);
        }
        if (p) {
          p.replaceWith(nP);
        }
        if (bC) {
          bC.replaceWith(nBC);
        }
        if (f) {
          f.replaceWith(nF);
        }
        Wrap();
        filters.action();
        if (l == 'form') {
          check.cart();
          Quantity(container);
          cart.buttons();
        } else {
          if (theme.settings.quickView) {
            Quick();
          };
          if (theme.settings.compare) {
            CompareProducts();
          };
        }
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
      }).catch(function (err) {
        console.log('!: ' + err);
      });      
    };
    var filters = {
      action:function (e) {
        var pA = container.querySelectorAll('.paginateBy'),
            sB = container.querySelector('select.sortBy');
        pA.forEach(function(p) {
          p.onclick = function(ev){ 
            var u = new URL(window.location),
                params = u.searchParams;
            u.search = params.toString();
            var url = u.toString(),
                pag = this.textContent;
            aB.style.display = 'block';
            fetch(theme.routes_cart_url + '.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({attributes: {'pagination': pag }})
            }).then(function () {
              ajaxLoadPage(url);
            });
          }
        });        
        var fA = container.querySelectorAll('li.advanced-filter a');
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
        var dS = container.querySelectorAll('.dropdown select');
        dS.forEach(function(d) {
          d.onchange = function(){
            if (d.value) {
              location.href = d.value;
            }
            else {
              location.href = theme.routes_all_products_collection_url;
            }
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
        if (iW <= theme.breakpoint_margin) {
          if (sD) {
            sD.open = false;
          }
          dO.forEach(function(d) {
            d.open = false;
          });
        }            
      }
    };
    if (l == 'form') {
      var check = {
        cart:function (e) {
          fetch(theme.routes_cart_url + '.js')
          .then(function(r) {
            return r.json();
          }).then(function(j) {
            var its = j.items;
            for (i = 0, len = its.length; i < len; i++) {
              let it = its[i],
                  iq = it.quantity,
                  id = it.id,
                  ti = document.getElementById('updates_' + id) || null;
              var er = document.getElementById('error_' + id);
              if (ti) {
                ti.setAttribute('value', iq);
                er.style.display = 'block';
                er.textContent = theme.language.collections_general_update_cart_label_message;
                document.getElementById('variant_' + id).classList.add('item-in-cart');
              }
            }
          });
        }
      }; 
      function cart_change(q) {
        var it = q.closest('.item'),
            id = it.getAttribute('data-product-id'),
            q =  it.querySelector('.item-qty').value,
            iQ = it.querySelector('.item-qty'),
            iB = it.querySelectorAll('.qtybtn'),
            s = it.querySelector('.error');
        it.querySelector('.item-qty').setAttribute('value',q)
        if (it.classList.contains('item-in-cart')) {
          var u = theme.routes_cart_change_url;
        } else {
          var u = theme.routes_cart_add_url;
        }
        fetch(u + '.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'quantity': q,'id':id})
        }).then(function(r) {
          return r.json();
        }).then(function(j) {
          iB.forEach(function(i) {
            i.setAttribute('disabled', true)
          });
          if (j.status == 'bad_request') {
            console.log('Request returned an error', j) 
          } else {            
            CartDrop();
            var v = iQ.value;
            var x = iQ.getAttribute('max');
            if (v < x && v > 0 ) {
            } else if (v == 0) {
              s.style.display = 'none';
              s.html = '';
            }
            if (q > 0) {
              it.classList.add('item-in-cart');
            } else {
              it.classList.remove('item-in-cart');
            }
            iB.forEach(function(i) {
              i.removeAttribute('disabled');
            });
          }
        }).catch(function(err) {
          console.error('!: ' + err)
        });
      }
      var cart = {
        buttons:function (e) {
          var qB = container.querySelectorAll('.qtybtn');
          qB.forEach(function(q) {                
            setTimeout(function () {
              q.onclick = function(ev){
                var qF = q.closest('.quantity.form'),
                    vV = qF.querySelector('.item-qty').getAttribute('value'),
                    vM = qF.querySelector('.item-qty').getAttribute('max'),
                    vL = qF.querySelector('.item-qty').getAttribute('min');              
                if (q.classList.contains('icon-plus')) {
                  var currentVal = vV;
                  if (isNaN(currentVal)) {
                    var currentVal = 0; 
                  };
                  nV = ++currentVal;
                  if (vM && vV == vM && nV > vM) {
                    return;
                  }                
                };               
                if (q.classList.contains('icon-minus')) {
                  var currentVal = vV;
                  if (isNaN(currentVal)) {
                    var currentVal = 2; 
                  };
                  nV = --currentVal;
                  if (vV == vL && vL > nV) {
                    return;
                  }
                };
                cart_change(q);
              }
            }, 1);
          })  ;
          var qI = container.querySelectorAll('.item-qty');
          qI.forEach(function(q) {
            let timeout;
            var vV = q.value,
                vM = q.getAttribute('max'),
                vL = q.getAttribute('min');            
            q.addEventListener('keyup', function (e) {
              if (e.key == 'Tab' || e.key == 'Shift') return;
              clearTimeout(timeout);
              timeout = setTimeout(function () {
                cart_change(q);
              }, 750);
            });
          });
        }
      };
      cart.buttons();
    }    
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
    if (l == 'form') {
      check.cart();
      Quantity(container);
    }
    Swatches(container);
    if (theme.settings.cart) {
      Cart(container);
    }
    var popped = ('state' in window.history && window.history.state !== null);
    var initialURL = location.href;
    window.onpopstate = function (e) {
      var initialPop = !popped && location.href == initialURL;
      popped = true;
      if (initialPop) {
        return;
      }
    };
    Shopify.queryParams = {};
    if (location.search.length) {
      for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
        aKeyValue = aCouples[i].split('=');
        if (aKeyValue.length > 1) {
          Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
        }
      }
    }
    Collection.prototype.onSelect = function(ev) {
      var Carousel = document.getElementById('glider-carousel-' + sectionId);
      if (Carousel) {
        Sliders(container);
      }
      if (theme.settings.quickView) {
        Quick();
      };
      if (theme.settings.compare) {
        CompareProducts();
      };
      Wrap();
    }
  }
  return Collection;
})();