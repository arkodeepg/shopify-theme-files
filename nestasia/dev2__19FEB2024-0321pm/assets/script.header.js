function ulHeight (container, rM) {
  theme.ulHeight = container.querySelector('.main-menu .customer-links').offsetHeight;
  rM.style.maxHeight = (theme.height - theme.ulHeight - 40) + 'px';
};
function MenuHeight (container) {
  var hdr = document.getElementById('header-toolbar'),
      stky = hdr.getAttribute('data-sticky');
  if (stky == 'true') {
    document.selectors = {
      sht: hdr.offsetHeight
    };
  } else {
    document.selectors = {
      sht: 0
    };
  };
  document.querySelector('html').style.scrollPaddingTop = document.selectors.sht + 'px';
  const iH = theme.height;
  const sN = container.querySelector('.sticky-navigation-container');
  const sNH = sN.offsetHeight;
  var cD = document.querySelector('#cart-dropdown span'),
      rM = container.querySelector('.responsiveMenu');
  if (cD) {
    var cDl = document.querySelector('#cart-dropdown .buttons').offsetHeight;
    if (theme.width <= theme.breakpoint_margin) {      
      cD.style.maxHeight = (iH - sNH - cDl - 30) + 'px';
    } else {
      cD.style.maxHeight = (iH - sNH - cDl) / 2 + 'px';
    }
  }  
  if (theme.mobile == false) {
    var pLu = rM.querySelectorAll('.parent-level-ul');
    pLu.forEach(function(p) {
      if (p) {
        p.style.setProperty('--max-height', iH - parseInt(document.selectors.sht) - 40 + 'px');
      }
    });  
  }
};
theme.Header = (function() {
  function Header(container) {
    var sectionId = container.getAttribute('data-section-id'),
        dD = container.getAttribute('data-dropdown'),
        t = container.querySelector('.toggleMenu'),
        r = container.querySelector('.responsiveMenu'),
        sN = container.querySelector('.sticky-navigation'),
        sNB = sN.getAttribute('data-border'),
        hNW = document.getElementById('header-navigation-width'),
        cCM = document.getElementById('cart-count-mobile'),
        cCMa = cCM.querySelector('.cart-count-mobile'),
        cCMb = container.querySelector('#cart-dropdown .modal-close'),
        m = container.getAttribute('data-multi'),
        pS = JSON.parse(document.getElementById('shopify-features').textContent),
        iH = theme.height,
        mmCL = container.querySelector('.main-menu .customer-links'),
        k = container.querySelectorAll('.header-customerbar .customer-links .keydown');
    function menuWidth() {      
      const pL = document.querySelectorAll('.visually-hidden .visually-hidden-links');
      theme.nW = 0;
      pL.forEach(function(p) {
        theme.nW += p.offsetWidth + 5;
      });
    }
    if(dD == 'true'){
      theme.dropdown = true;
    } else {
      theme.dropdown = false;
    }
    theme.cart = false;    
    function menuAdjust() {
      var iW = theme.width,
          nW = theme.nW,
          mMW = theme.breakpoint_margin,
          tW = container.querySelector('#header-navigation .header-navigation-measure').offsetWidth - parseInt(container.getAttribute('data-logo-width'));
      if (nW > tW) {
        theme.updateNav = true;
      } else {
        theme.updateNav = false;
      };
      var tM = document.querySelector('.toggleMenu'),
          rM = document.querySelector('.responsiveMenu'),
          cD = document.getElementById('cart-dropdown'),
          cCM = document.getElementById('cart-count-mobile'),
          cCD = document.getElementById('cart-count-desktop'),
          rMl = rM.querySelectorAll('li');
      if (iW <= mMW) {
        if (cD) {
          cCM.appendChild(cD);
        };
      } else {
        if (cD) {
          cCD.appendChild(cD);
        };
      };
      if (iW <= mMW || theme.updateNav || theme.detectmob) {
        tM.classList.remove('isDesktop');
        tM.classList.add('isMobile');
        rM.classList.remove('isDesktop');
        rM.classList.add('isMobile');
        var pLu = rM.querySelectorAll('.parent-level-ul');
        pLu.forEach(function(p) {
          p.removeAttribute('style');
          if (p.querySelector('a.child')) {
            p.querySelector('a.child').setAttribute('aria-popup','true');
            p.querySelector('a.child').setAttribute('aria-expanded','false');
          }      
        });
        rMl.forEach(function(r) {
          r.onmouseenter = function(ev){
            return false;
          };      
          r.onmouseleave = function(ev){
            return false;
          };
          r.classList.remove('isDesktop');
          r.classList.add('isMobile');
        });
        var rMp = rM.querySelectorAll('li.has-dropdown a.parent');
        rMp.forEach(function(r) {          
          r.onclick = function(ev){
            var pE = r.parentElement,
                pEuL = pE.querySelector('ul');
            if((r.getAttribute('href') != 'undefined') && r.getAttribute('href') != '#' && ev.target.matches('span')){   
            } else {
              ev.preventDefault();
              pEuL.style.setProperty('--max-height', pEuL.scrollHeight + 'px');
              if (pE.classList.contains('child-level')) {
                var h = pE.closest('.parent-level-ul').scrollHeight;
                pE.closest('.parent-level-ul').style.setProperty('--max-height', (pEuL.scrollHeight + h) + 'px');
              }
              pE.classList.toggle('hover');
              r.setAttribute('aria-expanded', 
                r.getAttribute('aria-expanded') === 'true' 
                  ? 'false' 
                  : 'true'
              );
            }
          };
        });
        document.body.classList.remove('desktop-only');
        document.body.classList.add('mobile-only');
        theme.mobile = true;
      } else if (iW > mMW) {
        var hoverTimeout;    
        tM.classList.remove('isMobile');
        tM.classList.add('isDesktop');
        rM.classList.remove('isMobile');
        rM.classList.add('isDesktop');
        var pLu = rM.querySelectorAll('.parent-level-ul');
        pLu.forEach(function(p) {
          if (p.querySelector('a.child')) {
            p.querySelector('a.child').removeAttribute('aria-popup');
            p.querySelector('a.child').removeAttribute('aria-expanded');
          }
        });
        rMl.forEach(function(r) {
          r.classList.remove('hover','isMobile');
          r.classList.add('isDesktop');
        });
        function open(r) {
          var rMh = rM.querySelectorAll('li.hover');
          rMh.forEach(function(r) {
            r.classList.remove('hover');
            r.querySelector('a.parent').setAttribute('aria-expanded','false');
          });
          clearTimeout(hoverTimeout);
          r.classList.add('hover');
          r.querySelector('a.parent').setAttribute('aria-expanded','true');          
        }
        function close(r) {
          hoverTimeout = setTimeout(function() {
            r.classList.remove('hover');
            r.querySelector('a.parent').setAttribute('aria-expanded','false');
          },250);
        }
        var rMp = rM.querySelectorAll('li.parent');
        rMp.forEach(function(r) {         
          r.addEventListener('keydown', function(ev) {
            r.classList.add('focused');
          });          
          r.querySelector('a.parent').onblur = function(ev){
            r.classList.remove('focused');
          }
          r.querySelector('a.parent').onclick = function(ev){
            if (r.classList.contains('focused')) {
              ev.preventDefault();
            }
            if (r.classList.contains('hover')) {
              close(r);
            } else {
              open(r);                
            }
          };
          r.onmouseenter = function(ev){
            open(r);
          };
          r.onmouseleave = function(ev){
            close(r);
          };
        });
        document.body.classList.remove('mobile-only');
        document.body.classList.add('desktop-only');
        theme.mobile = false;
      }
    }
    if (location.pathname == '/challenge') {
      window.location.hash = '';
      window.scrollTo(0, 0);      
    } else if (window.location.hash) {
      setTimeout(function () {
        var hsh = location.hash;
        var hc = document.querySelector(hsh);
        if (!hc) {
          return;
        }
        var s = hc.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
      }, 1);
    } else if (window.location.href.indexOf('customer_posted') > -1 || window.location.href.indexOf('contact?contact_posted') > -1) {
      if (document.cookie.split('AveForm=popUp').length == 1) {
        MenuHeight(container,theme.mobile);
        var fb = document.querySelector('.feedback'); 
        if (!fb) {
          return; 
        }
        var s = fb.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
      }
    }
    function menu_open(r) {
      t.classList.add('active');
      document.body.classList.add('modal-active');        
      r.classList.add('open');        
      t.setAttribute('aria-expanded','true');      
      setTimeout(function() {
        ulHeight(container, r);  
        trapFocus(sN); 
      }, 1);      
      sN.style.height = (sN.getBoundingClientRect().height - parseInt(sNB)) + 'px';     
      document.body.classList.add('no-scroll');
    };
    function menu_close(r) {
      t.classList.remove('active');
      document.body.classList.remove('modal-active');
      r.classList.remove('open');
      t.setAttribute('aria-expanded','false');
      document.body.classList.add('clear-scroll');
      removeTrapFocus(sN);
      document.body.classList.remove('no-scroll');
      setTimeout(function() {
        document.body.classList.remove('clear-scroll');
      }, 500);
    };    
    t.onclick = function(ev){
      if (!r.classList.contains('open')) {
        menu_open(r);        
      } else {
        menu_close(r);
      };
      cCM.classList.remove('hover');
      if (cCMb && document.getElementById('cart-dropdown')) {
        container.querySelector('#cart-dropdown .modal-close').classList.add('hidden');
      }    
    }
    function open(r) {
      var l = container.querySelectorAll('.header-customerbar .customer-links li.hover');
      l.forEach(function(r) {
        r.classList.remove('hover');
        r.querySelector('.keydown-link').setAttribute('aria-expanded','false');
      });
      r.classList.add('hover');
      r.querySelector('.keydown-link').setAttribute('aria-expanded','true');  
    }
    function close(r) {
      r.classList.remove('hover');
      r.querySelector('.keydown-link').setAttribute('aria-expanded','false');
    }
    k.forEach(function(r) {
      r.addEventListener('keydown', function(ev) {
        r.classList.add('focused');
      });          
      r.querySelector('.keydown-link').onblur = function(ev){
        r.classList.remove('focused');
      }
      r.querySelector('.keydown-link').onclick = function(ev){
        if (r.classList.contains('focused')) {
          ev.preventDefault();
        }
        if (r.classList.contains('hover')) {
          close(r);
        } else {
          open(r);
        }
      };
      r.onmouseenter = function(ev){
        open(r);
      };
      r.onmouseleave = function(ev){
        close(r);
      };
    });    
    if(theme.dropdown == true){
      cCMa.onclick = function(ev){
        cCM.classList.toggle('hover');
        if (cCMb && document.getElementById('cart-dropdown')) {
          container.querySelector('#cart-dropdown .modal-close').classList.add('hidden');
        }
      }
    };
    function wS() {
      menuAdjust();
      sN.style.height = '';
      if (r.classList.contains('open')) {
        menu_close(r);
      };
    }
    var cW = window.innerWidth;
    window.addEventListener('resize', function() {
      theme.height = window.innerHeight;
      MenuHeight(container,theme.mobile);
      if (cW == window.innerWidth) {
        return;
      }
      cW = window.innerWidth;
      wS();   
    });
    menuWidth();
    menuAdjust();
    MenuHeight(container,theme.mobile);    
    theme.multiHead = m;
    if (theme.multiHead == 'true') {
      Multi();
    }
    var el = document.querySelectorAll('.search details');
    el.forEach(function(e) {      
      e.onclick = function(ev){
        var moR = container.querySelector('.mobile-only .responsiveMenu');
        if(theme.width <= theme.breakpoint_margin){
          var dd = document.getElementById('cart-count-mobile');
        } else {
          var dd = document.getElementById('cart-count-desktop');
        }
        dd.classList.remove('hover');
        dd.classList.add('avoid');
        var ddC = dd.querySelector('.modal-close');
        if (ddC) {
          ddC.classList.add('hidden');
        }
        setTimeout(function() {
          dd.classList.remove('avoid');
        }, 1);
        if(t.classList.contains('active')) {
          t.classList.remove('active');          
          moR.classList.remove('open');
          moR.classList.remove('active');
          document.body.classList.remove('no-scroll');
          document.body.classList.remove('modal-active');
          document.body.style.position = '';
          document.body.style.left = 'auto';
          document.body.style.right = 'auto';
          document.body.style.top = 'auto';
        }
        var li = e.closest('li'),
            mC = li.querySelector('.modal-close.hidden'),
            sF = li.querySelector('.header-searchbar .search-field');
        setTimeout(function () {
          sF.value = '';
          if (e.hasAttribute('open')) {
            sF.disabled = false;
            trapFocus(li);
            mC.setAttribute('tabindex','1');
            sF.focus();
          } else {
            sF.disabled = true;
            removeTrapFocus(li);
            mC.setAttribute('tabindex','-1');
            sF.blur();
          }
        }, 0);
      }
    });
    if(container.getAttribute('data-search') == 'true'){
      function debounce(fn, wait) {
        let t;
        return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn.apply(this, args), wait);
        };
      }
      class PredictiveSearch extends HTMLElement {
        constructor() {
          super();
          this.cachedResults = {};
          this.input = this.querySelector('input[type="search"]');
          this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
          this.animate = this.closest('.animate-section');
          this.predictiveSearchResultsTop = this.getBoundingClientRect().top;
          this.isOpen = false;
          this.setupEventListeners();
        }
        setupEventListeners() {
          const form = this.querySelector('form.search');    
          form.addEventListener('submit', this.onFormSubmit.bind(this));
          this.input.addEventListener('input', debounce((event) => {
            this.onChange(event);
          }, 300).bind(this));
          this.input.addEventListener('focus', this.onFocus.bind(this));
          this.addEventListener('focusout', this.onFocusOut.bind(this));
        }
        getQuery() {
          return this.input.value.trim();
        }
        onChange() {
          const searchTerm = this.getQuery();
          if (!searchTerm.length) {
            this.close(true);
            return;
          }
          this.getSearchResults(searchTerm);
        }
        onFormSubmit(event) {
          if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
        }
        onFocus() {
          const searchTerm = this.getQuery();
          if (!searchTerm.length) return;
          if (this.getAttribute('results') === 'true') {
            this.open();
          } else {
            this.getSearchResults(searchTerm);
          }          
        }
        onFocusOut() {
          setTimeout(() => {if (!this.contains(document.activeElement)) this.close();})    
        }
        getSearchResults(searchTerm) {
          const queryKey = searchTerm.replace(" ", "-").toLowerCase();
          if (this.cachedResults[queryKey]) {
            this.renderSearchResults(this.cachedResults[queryKey]);
            return;
          }
          const search_limit = this.predictiveSearchResults.getAttribute('data-search-limit');
          const search_fields = this.predictiveSearchResults.getAttribute('data-search-fields');
          if (pS.predictiveSearch ==  true) {
            var URL = theme.routes_predictive_search_url + '?&q=' + encodeURIComponent(searchTerm) + '&section_id=predictive-search&' + encodeURIComponent('resources[fields]') + '=' + search_fields + '&' + encodeURIComponent('resources[limit]') + '=' + search_limit;
          } else {
            var URL = theme.routes_search_url + '?&q=' + encodeURIComponent(searchTerm) + '&section_id=predictive-search&options[prefix]=last';
          }
          fetch(URL)
          .then((response) => {
            if (!response.ok) {
              var error = new Error(response.status);
              this.close();
              throw error;
            }
            return response.text();
          })
          .then((text) => {
            const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
            this.cachedResults[queryKey] = resultsMarkup;
            this.renderSearchResults(resultsMarkup);
          })
          .catch((error) => {
            this.close();
            throw error;
          });
        }
        renderSearchResults(resultsMarkup) {
          this.predictiveSearchResults.innerHTML = resultsMarkup;
          const btn = this.querySelector('.modal-close');
          const ps = this;
          btn.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
              ps.close();
            }
          });
          btn.addEventListener('click', function(ev) {
            ps.close();
          }, false);
          this.setAttribute('results', true);
          this.setLiveRegionResults();
          this.open();
        }
        setLiveRegionResults() {
          this.removeAttribute('loading');
        }
        getResultsMaxHeight() {
          this.resultsMaxHeight = theme.height - this.getBoundingClientRect().top - 80;
          return this.resultsMaxHeight;
        }
        open() {
          if(theme.width <= theme.breakpoint_margin){
            var dd = document.getElementById('cart-count-mobile');
          } else {
            var dd = document.getElementById('cart-count-desktop');
          }
          dd.classList.remove('hover');
          dd.classList.add('avoid');
          var ddC = dd.querySelector('.modal-close');
          if (ddC) {
            ddC.classList.add('hidden');
          };
          setTimeout(function() {
            dd.classList.remove('avoid');
          }, 1);
          var height = this.resultsMaxHeight || `${this.getResultsMaxHeight()}`;          
          this.predictiveSearchResults.style.setProperty('--max-height', height + 'px');          
          this.setAttribute('open', true);
          this.predictiveSearchResults.setAttribute('aria-expanded', true);
          this.isOpen = true;
          this.querySelector('form.search').classList.add('active');
          if (this.animate) {
            this.animate.classList.add('filter-loaded');
          }
        }
        close(clearSearchTerm = false) {
          if (clearSearchTerm) {
            this.input.value = '';
            this.removeAttribute('results');
          }    
          this.querySelector('form.search').classList.remove('open');
          const selected = this.querySelector('[aria-selected="true"]');
          if (selected) selected.setAttribute('aria-selected', false);
          this.removeAttribute('open');
          this.predictiveSearchResults.setAttribute('aria-expanded', false);
          this.resultsMaxHeight = false;
          this.querySelector('form.search').classList.remove('active');
          this.isOpen = false;
          if (this.animate) {
            var _this = this;                        
            setTimeout(function() {
              _this.animate.classList.remove('filter-loaded');
            }, 250);
          }
          this.classList.remove('focused');          
          this.input.removeEventListener('focus', this.onFocus.bind(this));
          this.removeEventListener('focusout', this.onFocusOut.bind(this));
        }
      }
      customElements.define('predictive-search', PredictiveSearch); 
	};
    document.body.classList.remove('loading');
  }
  return Header;
})();