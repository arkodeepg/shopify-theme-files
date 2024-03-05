window.theme = window.theme || {};
theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];
  document.addEventListener('shopify:section:load',this._onSectionLoad.bind(this));
  document.addEventListener('shopify:section:unload',this._onSectionUnload.bind(this));
  document.addEventListener('shopify:section:select',this._onSelect.bind(this));
  document.addEventListener('shopify:section:deselect',this._onDeselect.bind(this));
  document.addEventListener('shopify:block:select',this._onBlockSelect.bind(this));
  document.addEventListener('shopify:block:deselect',this._onBlockDeselect.bind(this));
};

!(function () {
  "undefined" == typeof window.Shopify && (window.Shopify = {}),
    (Shopify.each = function (t, e) {
    for (var n = 0; n < t.length; n++) e(t[n], n);
  }),
    (Shopify.map = function (t, e) {
    for (var n = [], i = 0; i < t.length; i++) n.push(e(t[i], i));
    return n;
  }),
    (Shopify.arrayIncludes = function (t, e) {
    for (var n = 0; n < t.length; n++) if (t[n] == e) return !0;
    return !1;
  }),
    (Shopify.uniq = function (t) {
    for (var e = [], n = 0; n < t.length; n++) Shopify.arrayIncludes(e, t[n]) || e.push(t[n]);
    return e;
  }),
    (Shopify.isDefined = function (t) {
    return "undefined" != typeof t;
  }),
    (Shopify.getClass = function (t) {
    return Object.prototype.toString.call(t).slice(8, -1);
  }),
    (Shopify.extend = function (t, e) {
    function n() {}
    (n.prototype = e.prototype), (t.prototype = new n()), (t.prototype.constructor = t), (t.baseConstructor = e), (t.superClass = e.prototype);
  }),
    (Shopify.locationSearch = function () {
    return window.location.search;
  }),
    (Shopify.locationHash = function () {
    return window.location.hash;
  }),
    (Shopify.replaceState = function (t) {
    window.history.replaceState({}, document.title, t);
  }),
    (Shopify.urlParam = function (t) {
    var e = RegExp("[?&]" + t + "=([^&#]*)").exec(Shopify.locationSearch());
    return e && decodeURIComponent(e[1].replace(/\+/g, " "));
  }),
    (Shopify.newState = function (t, e) {
    var n;
    return (
      (n = Shopify.urlParam(t) ? Shopify.locationSearch().replace(RegExp("(" + t + "=)[^&#]+"), "$1" + e) : "" === Shopify.locationSearch() ? "?" + t + "=" + e : Shopify.locationSearch() + "&" + t + "=" + e),
      n + Shopify.locationHash()
    );
  }),
    (Shopify.setParam = function (t, e) {
    Shopify.replaceState(Shopify.newState(t, e));
  }),
    (Shopify.money_format = "${{amount}}"),
    (Shopify.formatMoney = function (t, e) {
    function n(t, e) {
      return "undefined" == typeof t ? e : t;
    }
    function i(t, e, i, r) {
      if (((e = n(e, 2)), (i = n(i, ",")), (r = n(r, ".")), isNaN(t) || null == t)) return 0;
      t = (t / 100).toFixed(e);
      var o = t.split("."),
          s = o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i),
          a = o[1] ? r + o[1] : "";
      return s + a;
    }
    "string" == typeof t && (t = t.replace(".", ""));
    var r = "",
        o = /\{\{\s*(\w+)\s*\}\}/,
        s = e || this.money_format;
    switch (s.match(o)[1]) {
      case "amount":
        r = i(t, 2);
        break;
      case "amount_no_decimals":
        r = i(t, 0);
        break;
      case "amount_with_comma_separator":
        r = i(t, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        r = i(t, 0, ".", ",");
        break;
      case "amount_no_decimals_with_space_separator":
        r = i(t, 0, " ");
        break;
      case "amount_with_apostrophe_separator":
        r = i(t, 2, "'");
    }
    return s.replace(o, r);
  })
})();

var sectionEvents = [];
var scriptsLoaded = [];  

function sectionObserver(){
  var lazySections = [].slice.call(document.querySelectorAll('.shopify-section section:not(.loaded)'));
  let lazySectionObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        let lazySection = entry.target;
        let lazyURL = lazySection.dataset.url;
        lazySection.classList.add('loaded');
        function sendSectionData(data){
          const sectionLoaded = new CustomEvent('Section:Loaded', {
            'detail': data
          });
          document.dispatchEvent(sectionLoaded);
          sectionEvents.push(sectionLoaded);
        }
        function loadScript(url, callback){
          var head = document.head;
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          script.async = false;
          script.onload = callback(lazySection);
          head.appendChild(script);
          scriptsLoaded.push(lazyURL);
        }
        if (lazyURL) {
          if (!scriptsLoaded.includes(lazyURL)) {
            loadScript(lazyURL, sendSectionData);
          } else {
            sendSectionData(lazySection)
          }
        }        
        lazySectionObserver.unobserve(lazySection);
      }
    });
  });
  lazySections.forEach(function(lazySection) {
    lazySectionObserver.observe(lazySection);
  });
};

if (theme.settings.animate) {
  function animateObserver(){
    var lazyAnimates = [].slice.call(document.querySelectorAll('.animate-section-div'));
    let lazyAnimateObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        let lazyAnimate = entry.target;
        var aaS = lazyAnimate.querySelectorAll('.animate-section');
        aaS.forEach(function(a) {
          if (entry.isIntersecting) {
            a.classList.add('go');
            a.classList.remove('stop');
            if (entry.boundingClientRect.top < 0) {
              a.classList.add('down');
              a.classList.remove('up');
            } else {
              a.classList.add('up');
              a.classList.remove('down');
            }
          } else {
            a.classList.remove('load','loaded');
            a.classList.add('stop');
            a.classList.remove('go');
          }
        });
      });
    });
    lazyAnimates.forEach(function(lazyAnimate) {
      lazyAnimateObserver.observe(lazyAnimate);
    });
  }
}

theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var id = container.getAttribute('data-section-id');
    var type = container.getAttribute('data-section-type');
    constructor = constructor || this.constructors[type];
    if (typeof constructor === 'undefined') {
      return;
    }
    var instance = Object.assign(new constructor(container), {
      id: id,
      type: type,
      container: container
    });
    this.instances.push(instance);
  },
  _onSectionLoad: function(evt) {
    sectionObserver();
    document.body.classList.remove('modal-active');
    document.getElementById('ajaxBusy').style.display = 'none';
    var container = document.querySelector(
      '[data-section-id="' + evt.detail.sectionId + '"]'
    );
    if (container) {
      this._createInstance(container);
    }
  },
  _onSectionUnload: function(evt) {
    this.instances = this.instances.filter(function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;
      if (isEventInstance) {
        if (typeof instance.onUnload === 'function') {
          instance.onUnload(evt);
        }
      }
      return !isEventInstance;
    });
  },
  _onSelect: function(evt) {
   var element = document.querySelectorAll('.animate-section');
    element.forEach(function(e) {
      e.classList.remove('animate-section');
    });
    var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });
    if (typeof instance !== 'undefined' && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },
  _onDeselect: function(evt) {
     var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });
    if (typeof instance !== 'undefined' && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },
  _onBlockSelect: function(evt) {
     var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });
    if (typeof instance !== 'undefined' && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },
  _onBlockDeselect: function(evt) {
     var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });
    if (typeof instance !== 'undefined' && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },
  register: function(type, constructor) {
    this.constructors[type] = constructor;
    document.querySelectorAll('[data-section-type="' + type + '"]').forEach(
      function(container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

theme.Helpers = (function() {
  var touchDevice = false;
  function setTouch() {
    touchDevice = true;
  }
  function isTouch() {
    return touchDevice;
  }
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
          args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  function getScript(source, beforeEl) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      var prior = beforeEl || document.getElementsByTagName('script')[0];
      script.async = true;
      script.defer = true;
      function onloadHander(_, isAbort) {
        if (
          isAbort ||
          !script.readyState ||
          /loaded|complete/.test(script.readyState)
        ) {
          script.onload = null;
          script.onreadystatechange = null;
          script = undefined;

          if (isAbort) {
            reject();
          } else {
            resolve();
          }
        }
      }
      script.onload = onloadHander;
      script.onreadystatechange = onloadHander;
      script.src = source;
      prior.parentNode.insertBefore(script, prior);
    });
  }
  return {
    setTouch: setTouch,
    isTouch: isTouch,
    debounce: debounce,
    getScript: getScript
  };
})();

if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
  sectionObserver();
  if (theme.settings.animate) {animateObserver();};
}

function Sliders(container) {
  var type = container.getAttribute('data-carousel-type');
  if (type == 'section') {
    var sectionId = container.getAttribute('data-section-id');
  } else {
    var sectionId = container.querySelector('.product-loop[data-glider="loaded"]').getAttribute('data-block-id');
  }  
  var Carousel = document.getElementById('glider-carousel-' + sectionId);
  if (Carousel) {
    var dS = Carousel.getAttribute('data-slides');
    var dL = Carousel.getAttribute('data-limit');
    var next = document.getElementById('glider-button-next-' + sectionId);
    var prev = document.getElementById('glider-button-prev-' + sectionId);
    if (dS) {
      var S = dS;
    } else {
      var S = 1.5;
    }
    if (dL && dL > 2.5) {
      var M = 2.5
    } else {
      var M = dL
    }
    if (dL) {
      var L = dL;
    } else {
      var L = 4.5;
    }
    var glider = new Glider(Carousel, {
      arrows: {
        prev: prev,
        next: next
      },
      draggable: true,
      dragVelocity:1,
      rewind: true,
      resizeLock: false,
      skipTrack: true,
      slidesToShow: 1,
      slidesToScroll: 'auto',
      responsive: [
        {
          breakpoint: 1,
          settings: {
            slidesToShow: S
          }
        },
        {
          breakpoint: 601,
          settings: {
            slidesToShow: M
          }
        },
        {
          breakpoint: 769,
          settings: {
            slidesToShow: L
          }
        }
      ]
    });
    if (glider) {
      Carousel.classList.add('loaded');
      for (var i = 0; i <= 4; ++i){
        var p = Carousel.querySelector('.product:not(.ignore)[data-gslide="' + i + '"]')
        if (p) {
          p.classList.add('ignore');
        }
      }
    }
    Carousel.addEventListener('glider-slide-visible', function(ev) {        
      var n = ev.detail.slide + 1;
      var p = Carousel.querySelector('.product:not(.ignore)[data-gslide="' + n + '"]')
      if (p) {
        p.classList.add('ignore');
      }
    });
  }  
};
//	Glider.js 1.7.4 | https://nickpiscitelli.github.io/Glider.js/ | Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//	gliderPrototype.bindDrag
!function(e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e():e()}(function(){var e="undefined"!=typeof window?window:this,t=e.Glider=function(t,o){var i=this;if(t._glider)return t._glider;if(i.ele=t,i.ele.classList.add("glider"),i.ele._glider=i,i.opt=Object.assign({},{slidesToScroll:1,slidesToShow:1,resizeLock:!0,duration:.5,easing:function(e,t,o,i,r){return i*(t/=r)*t+o}},o),i.animate_id=i.page=i.slide=0,i.arrows={},i._opt=i.opt,i.opt.skipTrack)i.track=i.ele.children[0];else for(i.track=document.createElement("div"),i.ele.appendChild(i.track);1!==i.ele.children.length;)i.track.appendChild(i.ele.children[0]);i.track.classList.add("glider-track"),i.init(),i.resize=i.init.bind(i,!0),i.event(i.ele,"add",{scroll:i.updateControls.bind(i)}),i.event(e,"add",{resize:i.resize})},o=t.prototype;return o.init=function(e,t){var o=this,i=0,r=0;o.slides=o.track.children,[].forEach.call(o.slides,function(e,t){e.classList.add("glider-slide"),e.setAttribute("data-gslide",t)}),o.containerWidth=o.ele.clientWidth;var s=o.settingsBreakpoint();if(t||(t=s),"auto"===o.opt.slidesToShow||void 0!==o.opt._autoSlide){var l=o.containerWidth/o.opt.itemWidth;o.opt._autoSlide=o.opt.slidesToShow=o.opt.exactWidth?l:Math.max(1,Math.floor(l))}"auto"===o.opt.slidesToScroll&&(o.opt.slidesToScroll=Math.floor(o.opt.slidesToShow)),o.itemWidth=o.opt.exactWidth?o.opt.itemWidth:o.containerWidth/o.opt.slidesToShow,[].forEach.call(o.slides,function(e){e.style.height="auto",e.style.width=o.itemWidth+"px",i+=o.itemWidth,r=Math.max(e.offsetHeight,r)}),o.track.style.width=i+"px",o.trackWidth=i,o.isDrag=!1,o.preventClick=!1,o.move=!1,o.opt.resizeLock&&o.scrollTo(o.slide*o.itemWidth,0),(s||t)&&(o.bindArrows(),o.buildDots(),o.bindDrag()),o.updateControls(),o.emit(e?"refresh":"loaded")},o.bindDrag=function(){var e=this;e.mouse=e.mouse||e.handleMouse.bind(e);var t=function(){e.mouseDown=void 0,e.ele.classList.remove("drag"),e.isDrag&&(e.preventClick=!0),e.isDrag=!1};const o=function(){e.move=!0};var i={mouseup:t,mouseleave:t,mousedown:function(t){t.preventDefault(),t.stopPropagation(),e.mouseDown=t.clientX,e.ele.classList.add("drag"),e.move=!1,setTimeout(o,300)},touchstart:function(t){e.ele.classList.add("drag"),e.move=!1,setTimeout(o,300)},mousemove:e.mouse,click:function(t){e.preventClick&&e.move&&(t.preventDefault(),t.stopPropagation()),e.preventClick=!1,e.move=!1}};e.ele.classList.toggle("draggable",!0===e.opt.draggable),e.event(e.ele,"remove",i),e.opt.draggable&&e.event(e.ele,"add",i)},o.buildDots=function(){var e=this;if(e.opt.dots){if("string"==typeof e.opt.dots?e.dots=document.querySelector(e.opt.dots):e.dots=e.opt.dots,e.dots){e.dots.innerHTML="",e.dots.classList.add("glider-dots");for(var t=0;t<Math.ceil(e.slides.length/e.opt.slidesToShow);++t){var o=document.createElement("button");o.dataset.index=t,o.setAttribute("aria-label","Page "+(t+1)),o.setAttribute("role","tab"),o.className="glider-dot "+(t?"":"active"),e.event(o,"add",{click:e.scrollItem.bind(e,t,!0)}),e.dots.appendChild(o)}}}else e.dots&&(e.dots.innerHTML="")},o.bindArrows=function(){var e=this;e.opt.arrows?["prev","next"].forEach(function(t){var o=e.opt.arrows[t];o&&("string"==typeof o&&(o=document.querySelector(o)),o&&(o._func=o._func||e.scrollItem.bind(e,t),e.event(o,"remove",{click:o._func}),e.event(o,"add",{click:o._func}),e.arrows[t]=o))}):Object.keys(e.arrows).forEach(function(t){var o=e.arrows[t];e.event(o,"remove",{click:o._func})})},o.updateControls=function(e){var t=this;e&&!t.opt.scrollPropagate&&e.stopPropagation();var o=t.containerWidth>=t.trackWidth;t.opt.rewind||(t.arrows.prev&&(t.arrows.prev.classList.toggle("disabled",t.ele.scrollLeft<=0||o),t.arrows.prev.classList.contains("disabled")?t.arrows.prev.setAttribute("aria-disabled",!0):t.arrows.prev.setAttribute("aria-disabled",!1)),t.arrows.next&&(t.arrows.next.classList.toggle("disabled",Math.ceil(t.ele.scrollLeft+t.containerWidth)>=Math.floor(t.trackWidth)||o),t.arrows.next.classList.contains("disabled")?t.arrows.next.setAttribute("aria-disabled",!0):t.arrows.next.setAttribute("aria-disabled",!1))),t.slide=Math.round(t.ele.scrollLeft/t.itemWidth),t.page=Math.round(t.ele.scrollLeft/t.containerWidth);var i=t.slide+Math.floor(Math.floor(t.opt.slidesToShow)/2),r=Math.floor(t.opt.slidesToShow)%2?0:i+1;1===Math.floor(t.opt.slidesToShow)&&(r=0),t.ele.scrollLeft+t.containerWidth>=Math.floor(t.trackWidth)&&(t.page=t.dots?t.dots.children.length-1:0),[].forEach.call(t.slides,function(e,o){var s=e.classList,l=s.contains("visible"),a=t.ele.scrollLeft,n=t.ele.scrollLeft+t.containerWidth,d=t.itemWidth*o,c=d+t.itemWidth;[].forEach.call(s,function(e){/^left|right/.test(e)&&s.remove(e)}),s.toggle("active",t.slide===o),i===o||r&&r===o?s.add("center"):(s.remove("center"),s.add([o<i?"left":"right",Math.abs(o-(o<i?i:r||i))].join("-")));var h=Math.ceil(d)>=Math.floor(a)&&Math.floor(c)<=Math.ceil(n);s.toggle("visible",h),h!==l&&t.emit("slide-"+(h?"visible":"hidden"),{slide:o})}),t.dots&&[].forEach.call(t.dots.children,function(e,o){e.classList.toggle("active",t.page===o)}),e&&t.opt.scrollLock&&(clearTimeout(t.scrollLock),t.scrollLock=setTimeout(function(){clearTimeout(t.scrollLock),Math.abs(t.ele.scrollLeft/t.itemWidth-t.slide)>.02&&(t.mouseDown||t.trackWidth>t.containerWidth+t.ele.scrollLeft&&t.scrollItem(t.getCurrentSlide()))},t.opt.scrollLockDelay||250))},o.getCurrentSlide=function(){var e=this;return e.round(e.ele.scrollLeft/e.itemWidth)},o.scrollItem=function(e,t,o){o&&o.preventDefault();var i=this,r=e;if(++i.animate_id,!0===t)e*=i.containerWidth,e=Math.round(e/i.itemWidth)*i.itemWidth;else{if("string"==typeof e){var s="prev"===e;if(e=i.opt.slidesToScroll%1||i.opt.slidesToShow%1?i.getCurrentSlide():i.slide,s?e-=i.opt.slidesToScroll:e+=i.opt.slidesToScroll,i.opt.rewind){var l=i.ele.scrollLeft;e=s&&!l?i.slides.length:!s&&l+i.containerWidth>=Math.floor(i.trackWidth)?0:e}}e=Math.max(Math.min(e,i.slides.length),0),i.slide=e,e=i.itemWidth*e}return i.scrollTo(e,i.opt.duration*Math.abs(i.ele.scrollLeft-e),function(){i.updateControls(),i.emit("animated",{value:r,type:"string"==typeof r?"arrow":t?"dot":"slide"})}),!1},o.settingsBreakpoint=function(){var t=this,o=t._opt.responsive;if(o){o.sort(function(e,t){return t.breakpoint-e.breakpoint});for(var i=0;i<o.length;++i){var r=o[i];if(e.innerWidth>=r.breakpoint)return t.breakpoint!==r.breakpoint&&(t.opt=Object.assign({},t._opt,r.settings),t.breakpoint=r.breakpoint,!0)}}var s=0!==t.breakpoint;return t.opt=Object.assign({},t._opt),t.breakpoint=0,s},o.scrollTo=function(t,o,i){var r=this,s=(new Date).getTime(),l=r.animate_id,a=function(){var n=(new Date).getTime()-s;r.ele.scrollLeft=r.ele.scrollLeft+(t-r.ele.scrollLeft)*r.opt.easing(0,n,0,1,o),n<o&&l===r.animate_id?e.requestAnimationFrame(a):(r.ele.scrollLeft=t,i&&i.call(r))};e.requestAnimationFrame(a)},o.removeItem=function(e){var t=this;t.slides.length&&(t.track.removeChild(t.slides[e]),t.refresh(!0),t.emit("remove"))},o.addItem=function(e){var t=this;t.track.appendChild(e),t.refresh(!0),t.emit("add")},o.handleMouse=function(e){var t=this;t.mouseDown&&(t.isDrag=!0,t.ele.scrollLeft+=(t.mouseDown-e.clientX)*(t.opt.dragVelocity||3.3),t.mouseDown=e.clientX)},o.round=function(e){var t=1/(this.opt.slidesToScroll%1||1);return Math.round(e*t)/t},o.refresh=function(e){this.init(!0,e)},o.setOption=function(e,t){var o=this;o.breakpoint&&!t?o._opt.responsive.forEach(function(t){t.breakpoint===o.breakpoint&&(t.settings=Object.assign({},t.settings,e))}):o._opt=Object.assign({},o._opt,e),o.breakpoint=0,o.settingsBreakpoint()},o.destroy=function(){var t=this,o=t.ele.cloneNode(!0),i=function(e){e.removeAttribute("style"),[].forEach.call(e.classList,function(t){/^glider/.test(t)&&e.classList.remove(t)})};o.children[0].outerHTML=o.children[0].innerHTML,i(o),[].forEach.call(o.getElementsByTagName("*"),i),t.ele.parentNode.replaceChild(o,t.ele),t.event(e,"remove",{resize:t.resize}),t.emit("destroy")},o.emit=function(t,o){var i=new e.CustomEvent("glider-"+t,{bubbles:!this.opt.eventPropagate,detail:o});this.ele.dispatchEvent(i)},o.event=function(e,t,o){var i=e[t+"EventListener"].bind(e);Object.keys(o).forEach(function(e){i(e,o[e])})},t});

function Swatches(container) {
  var se = container.querySelectorAll('.swatch-element');
  if(('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)){
    var tl = container.querySelectorAll('.product-thumb');
    tl.forEach(function(t) {
      t.classList.remove('enable-thumb-hover');
    });
    se.forEach(function(s) {
      var i = s.querySelector('input');
      var id = i.getAttribute('id');
      var group = i.getAttribute('data-group');
      i.addEventListener('click', function() {
        var ses = i.closest('.swatch.selectors');
        var sei = container.querySelector('.swatch-element.var_ignore[data-group="' + group + '"]');
        var ptvi = container.querySelector('.product-thumb-var.var_ignore[data-group="' + group + '"]');
        var ptv = container.querySelector('.product-thumb-var[id="swatch-' + id + '"]');
        var ptm = container.querySelector('.product-thumb-main[data-group="' + group + '"]');
        ses.classList.add('var_hover');
        if (sei) {
          sei.classList.remove('var_hover','var_ignore');
        }        
        if (ptvi) {
          ptvi.classList.remove('var_hover','var_ignore');
        }
        if (ptv) {
        ptv.classList.add('var_hover','var_ignore');
        }        
        s.classList.add('var_hover','var_ignore');
        if (ptm) {
          ptm.classList.add('var_hover');
        }
      }, false);      
    });
  } else {
    se.forEach(function(s) {
      var i = s.querySelector('input');
      var id = i.getAttribute('id');
      var group = i.getAttribute('data-group');
      s.onmouseenter = function(){
        var ses = i.closest('.swatch.selectors');
        var sei = container.querySelector('.swatch-element.var_ignore[data-group="' + group + '"]');
        var ptvi = container.querySelector('.product-thumb-var.var_ignore[data-group="' + group + '"]');
        var ptv = container.querySelector('.product-thumb-var[id="swatch-' + id + '"]');
        var ptm = container.querySelector('.product-thumb-main[data-group="' + group + '"]');
        ses.classList.remove('var_hover');
        if(!s.classList.contains('var_ignore')) {
          s.classList.add('var_hover');
          if (sei) {
            sei.classList.remove('var_hover','var_ignore');
          }
          if (ptvi) {
            ptvi.classList.remove('var_hover','var_ignore');
          }
          if (ptv) {
            ptv.classList.add('var_hover');
          }
          if (ptm) {
            ptm.classList.add('var_hover');
          }
        }
      };
      s.onmouseleave = function(){        
        var ptm = container.querySelector('.product-thumb-main[data-group="' + group + '"]');
        var ptv = container.querySelector('.product-thumb-var[id="swatch-' + id + '"]');
        if(!s.classList.contains('var_ignore')) {
          s.classList.remove('var_hover');
          if (ptv) {
            ptv.classList.remove('var_hover');
          }
          if (ptm) {
            ptm.classList.remove('var_hover');
          }
        }
      };
      i.onclick = function(ev){
        var ses = i.closest('.swatch.selectors');
        var sei = container.querySelector('.swatch-element.var_ignore[data-group="' + group + '"]');
        var ptvi = container.querySelector('.product-thumb-var.var_ignore[data-group="' + group + '"]');
        var ptv = container.querySelector('.product-thumb-var[id="swatch-' + id + '"]');
        var ptm = container.querySelector('.product-thumb-main[data-group="' + group + '"]');
        s.classList.add('var_hover','var_ignore');
        ses.classList.add('var_hover');
        if (sei) {
          sei.classList.remove('var_hover','var_ignore');
        }
        if (ptvi) {
          ptvi.classList.remove('var_hover','var_ignore');
        }
        if (ptv) {
          ptv.classList.add('var_hover','var_ignore');
        }
        if (ptm) {
          ptm.classList.add('var_hover');
        }
      };
    });
  }
};

function Wrap() {
  var el = document.querySelectorAll('.content iframe[src*="youtube.com"]:not(.no-container),.content iframe[src*="vimeo.com"]:not(.no-container)');
  el.forEach(function(e) {
    var wrapper = document.createElement('div');
    wrapper.className = 'youtube-container';
    e.classList.add('no-container');
    e.parentNode.insertBefore(wrapper, e);
    wrapper.appendChild(e);
  });
  var el = document.querySelectorAll('.youtube-container:not(.no-container)');
  el.forEach(function(e) {
    var wrapper = document.createElement('div');
    wrapper.className = 'loader';
    e.classList.add('no-container');
    e.appendChild(wrapper);
  }); 
  var el = document.querySelectorAll('table');
  el.forEach(function(e) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-container';
    e.parentNode.insertBefore(wrapper, e);
    wrapper.appendChild(e);
    wrapper.parentNode.classList.add('table-scroll');
  }); 
};

if (theme.settings.compare) {
  function CompareProducts() {
    var cLocalViewed = localStorage.cVP;
    const aB = document.getElementById('ajaxBusy');
    const m = document.querySelector('#quick-modal'); 
    const mc = m.querySelector('.modal-container'); 
    const mcC = mc.querySelector('.modal-content');
    function Compare(id) {
      const cpA = [];
      let cjR,
          cjRA,
          cjRAS;
      const cnP = 5;
      const cpD = {
        cID: id
      } 
      cpA.push(cpD);
      const ccpT = cpD.cID; 
      const cpDS = JSON.stringify(cpA);
      const clD = localStorage.getItem('cVP');
      if(clD == null) { 
        localStorage.setItem('cVP', cpDS);
      } else if (clD != null ) {
        const copD = localStorage.getItem('cVP');
        const ccpD = (copD.match(/cID/g) || []).length;
        const crP =  copD.includes(ccpT);
        if (ccpD < cnP && crP == false) {
          cjR = JSON.parse(copD);
          cjRA = cjR.concat(cpA);
          cjRAS = JSON.stringify(cjRA);
          localStorage.setItem('cVP', cjRAS);
        } else if (ccpD >= cnP && crP == false) {
          cjR = JSON.parse(copD);
          cjR.shift();
          cjRA = cjR.concat(cpA);
          cjRA =  JSON.stringify(cjRA);
          localStorage.setItem('cVP', cjRA);
        }
      }
    }
    function cRemove(id) {
      // Based on https://www.delftstack.com/howto/javascript/javascript-remove-object-from-array/
      var P = JSON.parse(localStorage.getItem('cVP'));
      var nP = P.filter((item) => item.cID !== id);
      localStorage.setItem('cVP', JSON.stringify(nP));// result set to local storage
    }
    function cChecked(cLocalViewed) {
      var cK = document.querySelectorAll('.comparison:checked');
      cK.forEach(function(e) {
        var nid = e.getAttribute('value');
        if (cLocalViewed && cLocalViewed.includes(nid)) {
          e.checked = true;
        } else {
          e.checked = false;
        }
      });
    }
    function cDelete() {
      var c = document.querySelectorAll('.compare-remove');
      c.forEach(function(e) {
        let id = e.getAttribute('data-id');
        e.onclick = function(ev) {
          var cR = document.querySelectorAll('.remove-product-' + id);
          cR.forEach(function(e) {
            e.classList.add('removing');
            setTimeout(function() {
              e.remove();
            }, 250);
          });
          cRemove(id);
          var cLocalViewed = localStorage.cVP;
          var n = JSON.parse(localStorage.getItem('cVP'));
          if (n.length == 0) {
            var h = mcC.querySelector('h3');
            var t = mcC.querySelector('table');
            h.classList.add('removing');
            t.classList.add('removing');
            setTimeout(function() {
              var d = document.createElement('div');
              d.classList.add('text-center', 'toppad');
              var h = document.createElement('h4');
              d.appendChild(h);
              h.textContent = theme.language.products_general_compare_empty_message;
              mcC.querySelector('.comparison-products').appendChild(d);
            }, 250);
            setTimeout(function() {
              h.remove();
              t.remove();
            }, 250);
          }
          cChecked(cLocalViewed);
        };
      });  
    }
    var c = document.querySelectorAll('.comparison');
    c.forEach(function(e) {
      var id = e.getAttribute('value');
      e.onclick = function(ev) {
        if (this.checked) {
          Compare(id);
        } else {
          cRemove(id);
        };
        var cLocalViewed = localStorage.cVP;
        cChecked(cLocalViewed);
      };
      if (cLocalViewed && cLocalViewed.includes(id)) {
        e.checked = true;
      }
    });
    var el = document.querySelectorAll('.compare-modal');
    el.forEach(function(e) {
      e.onclick = function(ev){
        e.focus();
        aB.style.display = 'block';
        const cD = JSON.parse(localStorage.getItem('cVP'));
        const cVH = [];
        if (cD && cD.length > 0) {
          cD.forEach(function(item,i){
            cVH.push('id:' + item.cID);
          });
          var crB = cVH.join('%20OR%20');
        } else {
          var crB = '';
        }
        fetch(theme.routes_search_url + '?view=compare&type=product&q=' + crB)
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const htmlDocument = parser.parseFromString(data, 'text/html');
          try {
            MicroModal.show('quick-modal', {
              onShow: function(modal) {
                m.classList.add('loaded');
                mc.classList.add('loaded');
                document.body.classList.add('modal-active');
              },
              onClose: function(modal) {
                const qV = m.querySelector('.modal-content .collection-products');
                setTimeout(function() {
                  m.classList.remove('loaded');
                  document.body.classList.remove('modal-active');
                  qV.remove();
                }, 250);
                mc.classList.remove('loaded');
                aB.style.display = 'none';
              },
              disableScroll: true
            });
          } catch (e) {
            console.log("micromodal error: ", e);
          }
          m.classList.add('loaded');
          var ccP = htmlDocument.documentElement.querySelector('.collection-products');
          mcC.appendChild(ccP);
          cDelete();
        });
      };
    });
  }
}

if (theme.settings.quickView) {
  function Quick() {
    const m = document.querySelector('#quick-modal'); 
    const mc = m.querySelector('.modal-container'); 
    const mcC = mc.querySelector('.modal-content'); 
    const aB = document.getElementById('ajaxBusy');
    var el = document.querySelectorAll('.quick');
    el.forEach(function(e) {
      e.onclick = function(ev){
        var js = document.head.querySelector('script[src*="/script.product.js"]');
        if(js){
          js.remove();
        }
        var url = this.getAttribute('data-src');
        e.focus();
        aB.style.display = 'block';
        fetch(url)
        .then(response => response.text())
        .then(text => {
          const parser = new DOMParser();
          const htmlDocument = parser.parseFromString(text, 'text/html');
          const section = htmlDocument.documentElement.querySelector('.product-id');
          const sectionId = section.getAttribute('data-section-id');
          try {
            MicroModal.show('quick-modal', {
              onShow: function(modal) {
                m.classList.add('loaded');
                mc.classList.add('loaded');
                document.body.classList.add('modal-active');
              },
              onClose: function(modal) {
                const qV = m.querySelector('#product-id-' + sectionId);
                setTimeout(function() {
                  m.classList.remove('loaded');
                  document.body.classList.remove('modal-active');
                  qV.remove();
                }, 250);
                mc.classList.remove('loaded');
                aB.style.display = 'none';
              },
              disableScroll: true
            });
          } catch (e) {
            console.log("micromodal error: ", e);
          }
          m.classList.add('loaded');
          mcC.appendChild(section);
          var container = document.getElementById('product-id-' + sectionId);
          var c = container.getAttribute('data-cart');
          sectionObserver();          
          Swatches(container);
          if(c == 'true'){
            Cart(container);
          }
          if (window.SPR) {
            SPR.initDomEls();
            SPR.loadBadges();
          }
          if (Shopify.PaymentButton) {
            Shopify.PaymentButton.init(); 
          }
        })
        ev.preventDefault();
      };
    });
  };
}

function Quantity(container) {
  var sectionId = container.getAttribute('data-section-id');
  var sectionType = container.getAttribute('data-section-type');
  var productId = container.getAttribute('data-product-id');
  var qp = container.querySelectorAll('.qtyplus_' + sectionId + ',.qtyplus_multi');
  if (sectionType && sectionType.indexOf('product') !== -1) {
    var p = true
  } else {
    var p = false
  }
  qp.forEach(function(q) {    
    function plus(ev) {
      var fieldName = q.getAttribute('field');
      var pricefieldName = q.getAttribute('price-field');
      var input = container.querySelector('input[id=' + pricefieldName + ']');
      if (input) {
        var priceid = input.getAttribute('price');
      }
      var key = document.getElementById(fieldName);
      var error = document.getElementById(key.getAttribute('field'));
      var max = key.getAttribute('max');
      var currentVal = key.value;
      if (isNaN(currentVal)) {
        var currentVal = 0; 
      };
      key.value = ++currentVal;
      if (!max) {        
        if (p == false) {
          error.style.display = 'block';
          error.textContent = theme.language.products_product_ajax_added;
        };
      } else if (max != 0) {
        if (++currentVal > max) { 
          error.style.display = 'block';
          error.innerHTML = theme.language.products_general_inv_msg_1 + '&nbsp;' + max + '&nbsp;' + theme.language.products_general_inv_msg_2;
          key.value = max;
          return;
        } else {
          if (p == false) {
            error.style.display = 'block';
            error.textContent = theme.language.products_product_ajax_added;
          }
        }
      } else if (max < 0) {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_disabled_add_to_cart;
        key.value = 0;
      } else {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_sold_out;
        key.value = 0;
      }
      var newVal = key.value;
      if (input) {
        input.value = newVal * priceid;
      }
    }
    if (sectionType == 'product-alt') {
      q.onclick = plus;
    } else {
      q.addEventListener('click', plus, false);
    }
  });
  var qm = container.querySelectorAll('.qtyminus_' + sectionId + ',.qtyminus_multi');
  qm.forEach(function(q) {
    function minus(ev) {
      var fieldName = q.getAttribute('field');
      var pricefieldName = q.getAttribute('price-field');
      var input = container.querySelector('input[id=' + pricefieldName + ']');
      if (input) {
        var priceid = input.getAttribute('price');
      }
      var key = document.getElementById(fieldName);
      var error = document.getElementById(key.getAttribute('field'));
      var min = key.getAttribute('min');
      var currentVal = key.value;
      if (isNaN(currentVal)) {
        var currentVal = 2; 
      };
      if (key.value > 0 && p == false) {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_ajax_updated;
      }
      if (!isNaN(currentVal) && currentVal > min) {
        key.value = --currentVal;  
      } else {
        key.value = min;  
      }
      var newVal = key.value;
      if (input) {
        input.value = newVal * priceid;
      }
    };
    if (sectionType == 'product-alt') {
      q.onclick = minus;
    } else {
      q.addEventListener('click', minus, false);
    }
  });
  var qu = container.querySelectorAll('input.quantity');
  qu.forEach(function(q) {    
    q.addEventListener('keyup', function(ev) {
      if (ev.key == 'Tab' || ev.key == 'Shift') return;
      var error = document.getElementById(q.getAttribute('field'));
      var max = parseInt(q.getAttribute('max'), 10);
      var min = parseInt(q.getAttribute('min'), 10);
      var value = parseInt((q.value), 10) || 0;
      var currentVal = value;
      if (isNaN(currentVal)) {
        var currentVal = 0; 
      };
      value = ++currentVal;
      error.style.display = 'none';
      if (!max) {
        if (p == false) {
          error.style.display = 'block';
          error.textContent = theme.language.products_product_ajax_updated;
        }
      } else if (max != 0) {
        if (value > max) {
          error.style.display = 'block';
          error.innerHTML = theme.language.products_general_inv_msg_1 + '&nbsp;' + max + '&nbsp;' + theme.language.products_general_inv_msg_2;
          q.value = max;
        } else {
          if (p == false) {
            error.style.display = 'block';
            error.textContent = theme.language.products_product_ajax_updated;
          }
        }
      } else if (max < 0) {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_disabled_add_to_cart;
        key.value = 0;
      } else {
        error.style.display = 'block';
        error.textContent = theme.language.products_product_sold_out;
        q.value = 0;
      }
    });
  });
  var rim = container.querySelectorAll('.remove_item_multi');
  rim.forEach(function(r) {
    r.addEventListener('click', function(ev) {
      var fieldName = r.getAttribute('field');
      var key = document.getElementById(fieldName);
      key.value = 0;
    }, false);
  });
};

function Cart(container,sI) {
  if (sI) {
    var sectionId = sI;
  } else {
    var sectionId = container.getAttribute('data-section-id');
  }
  var productId = container.getAttribute('data-product-id');  
  // var sU = container.querySelectorAll('[type="submit"]');
  // sU.forEach(function(s) {
  //   s.onclick = function(ev){      
  //     var p = s.closest('.go-to-cart-' + sectionId)
  //     var FB = p.querySelector('.feedback');
  //     var aFB = container.querySelector('.feedback.loaded');
  //     var t = p.querySelector('.feedback .icon-times');
  //     var c = p.querySelector('.feedback .icon-check');
  //     function fb(success, html) {
  //       FB.classList.add(success);
  //       FB.querySelector('.html').innerHTML = html;
  //       if (!FB.classList.contains('loaded')) {
  //         FB.classList.add('open');
  //         FB.style.height = 'auto';
  //         var FBht = FB.clientHeight;
  //         var FBhtpx = FBht + 'px';
  //         FB.style.height = '0px';
  //         setTimeout(function () {
  //           FB.style.height = FBhtpx;
  //         }, 0);
  //         setTimeout(function () {
  //           FB.classList.add('visible','loaded');
  //         }, 1);
  //       } else {
  //         FB.style.height = 'auto';
  //       }
  //     }
  //     const formData = new FormData(p);
  //     fetch(theme.routes_cart_add_url + '.js', {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'X-Requested-With': 'XMLHttpRequest'
  //       },
  //       body: formData
  //     }).then(function(r) {        
  //       return r.json();        
  //     }).then(function(j) { 
  //       if (aFB && !FB.classList.contains('loaded')) {
  //         if (!FB.classList.contains('loaded')) {
  //           aFB.style.height = '0px';
  //           aFB.classList.remove('visible','loaded')
  //           aFB.addEventListener('transitionend', function () {
  //             aFB.classList.remove('open')
  //           }, {once: true})
  //         }
  //       }      
  //       if (j.status) {
  //         console.log('Request returned an error', j)
  //         r = j.description;        
  //         if (typeof r === 'object') {
  //           var $message_text = [];
  //           for (const x in r) {
  //             $message_text.push('<span>' + x + '</span>' + ' ' + r[x] + '<br/>');
  //           }            
  //         } else {
  //           var $message_text = r;
  //         }
  //         t.classList.remove('hidden');
  //         c.classList.add('hidden');
  //         fb('error', $message_text);
  //       } else {
  //         s.innerText = theme.language.products_product_ajax_adding;
  //         s.classList.add('outline');
  //         s.setAttribute('disabled', true);
  //         window.setTimeout(function(){ 
  //           s.innerText = theme.language.products_product_ajax_thanks;
  //         }, 1000);
  //         c.classList.remove('hidden');
  //         t.classList.add('hidden');
  //         FB.classList.remove('error');
  //         fb('cart-success',theme.language.products_product_ajax_added + '&nbsp;<a href="' + theme.routes_cart_url + '">' + theme.language.products_product_ajax_view + '</a>');
  //         window.setTimeout(function(){
  //           s.classList.remove('outline');
  //           s.removeAttribute('disabled');
  //           s.innerText = s.getAttribute('data-atc');
  //         }, 2000);
  //         if (container.getAttribute('data-product-type') == 'quick' || theme.cart) {
  //           var x = true;
  //         } else {
  //           var x = false;
  //         }                       
  //         CartDrop(x);
  //       };
  //     }).catch(function(err) {
  //       console.error('!: ' + err)
  //     });
  //     if (theme.cart) {
  //       setTimeout(function () {
  //         fetch(theme.routes_cart_url)
  //         .then(response => response.text())
  //         .then(data => {
  //           CartReload(data);
  //         }).catch(function(err) {
  //           console.error('!: ' + err)
  //         });
  //       }, 1000);
  //     }
  //     ev.preventDefault();
  //   };
  // });  
};

function ShippingMsg() {  
  var sM = document.querySelectorAll('shipping-message p');
  if (sM.length > 0 ) {
    fetch(theme.routes_cart_url + '?section_id=shipping-message')
    .then(function(r) {
      return r.text();
    }).then(function(j) {
      const htmlDocument = new DOMParser().parseFromString(j, 'text/html');      
      const section = htmlDocument.querySelector('#shopify-section-shipping-message p').innerHTML;
      if (!section) {
        return
      };
      sM.forEach(function(s) {
        s.innerHTML = section;
      });
    }).catch(function(err) {
      console.error('!: ' + err)
    });
  }
}

function CartDrop(x) {
  ShippingMsg();
  var header = document.querySelector('header');
  if (!header) {
    return
  };
  if (theme.width <= theme.breakpoint_margin) {
    var dd = document.getElementById('cart-count-mobile');
  } else {
    var dd = document.getElementById('cart-count-desktop');
  }
  fetch(theme.routes_cart_url + '?section_id=cart-dropdown')
  .then(function(r) {
    return r.text();
  }).then(function(j) {
    const htmlDocument = new DOMParser().parseFromString(j, 'text/html');
    const section = htmlDocument.querySelector('#cart-dropdown').innerHTML;
    const iC = htmlDocument.querySelector('#cart-dropdown').getAttribute('data-items');
    const iT = htmlDocument.querySelector('#cart-dropdown').getAttribute('data-total');
    var cC = document.querySelectorAll('.cartCountSelector');
    var cT = document.querySelector('.cartTotalSelector');
    var ul = document.getElementById('cart-dropdown');    
    cC.forEach(function(c) {
      c.textContent = iC;
    });
    cT.innerHTML = iT
    if (iC > 0) {
      if (ul) {
        ul.querySelector('span').innerHTML = section;
      }
      if (!x && theme.dropdown == true) {
        var ddC = ul.querySelector('.modal-close');
        ddC.classList.remove('hidden');
        ddC.onclick = function(ev){
          dd.classList.remove('hover');
          dd.classList.add('avoid');
          ddC.classList.add('hidden');
          setTimeout(function() {
            dd.classList.remove('avoid');
          }, 350);
          ev.preventDefault();
        };
      };
      ul.classList.remove('hidden');
      if (!x && theme.dropdown == true) {
        dd.classList.add('hover');
        trapFocus(ul);
      };
    } else {
      if (theme.dropdown == true) {
        document.querySelector('.cart-count-mobile').setAttribute('href', theme.routes_cart_url);
        document.querySelector('.cart-count-mobile').classList.remove('void');
      }
      ul.classList.add('hidden');
    } 
  }).catch(function(err) {
    console.error('!: ' + err)
  });
};

function Multi() {
  var aB = document.getElementById('ajaxBusy');
  var el = document.querySelectorAll('.currency');
  el.forEach(function(e) {
    var cs = document.querySelectorAll('.currency-selector select');
    var ul = e.querySelector('ul');
    if (ul) {
      var aa = ul.querySelectorAll('button');
    }
    function x(a) {
      var dm = a.getAttribute('data-multi');
      var hs = a.getAttribute('data-header_symbol');
      var fs = a.getAttribute('data-footer_symbol');
      var hl = document.querySelector('header li.account.currency a[data-multi="' + dm + '"]');
      var fl = document.querySelector('footer .currency summary[data-multi="' + dm + '"]');
      if (hl) {
        hl.innerHTML = hs;
        hl.classList.remove('active');
      }
      if (fl) {
        fl.innerHTML = '<small>' + fs + '</small>';
        fl.classList.remove('active');
      }
      ul.style.display = 'none';
      aB.style.display = 'block';
    }
    if (aa) {
      aa.forEach(function(a) {
        a.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            x(a);
          }
        });
        a.onclick = function(e){   
          x(a);
        };
      });
    };
    cs.forEach(function(c) {
      c.onchange = function(){
        aB.style.display = 'block';
        aB.querySelector('.loader').classList.add('currency-active');
        c.closest('form').submit();
      };
    });
  });
};

function Tabs(container) {
  var sectionId = container.getAttribute('data-section-id');
  var type = container.getAttribute('data-carousel-type');
  var Carousel = document.getElementById('tabs-carousel-' + sectionId);  
  if (Carousel) {
    var next = document.getElementById('tabs-button-next-' + sectionId);
    var prev = document.getElementById('tabs-button-prev-' + sectionId);  
    var glider = new Glider(Carousel, {
      arrows: {
        prev: prev,
        next: next
      },
      draggable: true,
      dragVelocity:1,
      exactWidth: true,
      itemWidth: 140,
      resizeLock: false,
      skipTrack: true,
      slidesToShow: 'auto',
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 600,
          settings: {
            itemWidth: 180
          }
        }
      ]
    });  
    if (glider) {
      Carousel.classList.add('loaded');      
      setTimeout(function () {
        Carousel.classList.remove('load');
      }, 100);
    };
    // 	Based on https://css-tricks.com/tabs-its-complicated/ 
    (function() {
      const tabs = Carousel.querySelectorAll('a');
      const panels = container.querySelectorAll('.tab-body-id-' + sectionId);
      const switchTab = (oldTab, newTab) => {
        newTab.focus();
        newTab.classList.add('first');
        newTab.setAttribute('aria-selected', 'true');
        oldTab.blur();
        oldTab.classList.remove('first');
        oldTab.removeAttribute('aria-selected');
        let index = Array.prototype.indexOf.call(tabs, newTab);
        let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
        panels[oldIndex].classList.add('hide');
        var s = panels[oldIndex].querySelector('.product-loop[data-glider="loaded"]');
        if (s) {
          s.setAttribute('data-glider', 'ignore');
        }
        panels[index].classList.remove('hide');
        var loop = panels[index].querySelector('.product-loop[data-glider="unloaded"]');
        if (loop) {
          loop.setAttribute('data-glider', 'loaded');
          if (loop.getAttribute('data-glider') === 'loaded') {
            Sliders(container);
          }
          return false;
        }        
      }
      Array.prototype.forEach.call(tabs, (tab, i) => {
        tab.addEventListener('click', e => {
          e.preventDefault();
          let currentTab = Carousel.querySelector('[aria-selected]');
          currentTab.classList.remove('ignore');
          if (e.currentTarget !== currentTab) {
            switchTab(currentTab, e.currentTarget);
            e.currentTarget.classList.add('ignore');
          }
        });
        tab.addEventListener('keydown', e => {
          let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
          e.currentTarget.classList.remove('ignore');
          let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
          if (dir !== null) {
            e.preventDefault();
            dir === 'down' ? panels[i].focus() : tabs[dir] ? switchTab(e.currentTarget, tabs[dir]) : void 0;
          }
        });
      });
    })();
  };
};

function forceFocus(element, options) {
  options = options || {};
  var savedTabIndex = element.tabIndex;
  element.tabIndex = -1;
  element.dataset.tabIndex = savedTabIndex;
  element.focus();
  if (typeof options.className !== 'undefined') {
    element.classList.add(options.className);
  }
  element.addEventListener('blur', callback);
  function callback(event) {
    event.target.removeEventListener(event.type, callback);
    element.tabIndex = savedTabIndex;
    delete element.dataset.tabIndex;
    if (typeof options.className !== 'undefined') {
      element.classList.remove(options.className);
    }
  }
}

function focusable(container) {
  var elements = Array.prototype.slice.call(
    container.querySelectorAll(
      '[tabindex]:not([tabindex^='-']),' +
      '[draggable],' +
      'summary,'  +
      'a[href],' +
      'area,' +
      'button:enabled,' +
      'input:not([type=hidden]):enabled,' +
      'object,' +
      'select:enabled,' +
      'textarea:enabled,' +
      'object,' + 
      'iframe'
    )
  );
  return elements.filter(function(element) {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  });
}

const trapFocusHandlers = {};

function trapFocus(container, options) {
  removeTrapFocus();  
  options = options || {};
  var elements = focusable(container),
      elementToFocus = options.elementToFocus || container,
      first = elements[0],
      last = elements[elements.length - 1];
  trapFocusHandlers.focusin = function(event) {    
    if (container !== event.target && !container.contains(event.target)) {
      first.focus();
    }
    if (event.target !== container && event.target !== last && event.target !== first) return;
    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function(event) {
    if (event.keyCode !== 9) return;
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };
  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);
  forceFocus(elementToFocus, options);
}

function removeTrapFocus() {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);
}

if (Shopify.designMode) {  
  theme.Tabbed = (function(ev) {
    function Tabbed(container) {
      var sectionId = container.getAttribute('data-section-id');    
      this.container = container;
      this.sectionId = sectionId;
      var tI = container.querySelectorAll('.tabs-id-' + sectionId + ' a');
      tI.forEach(function(t) {
        t.onclick = function(ev) {
          var tH = container.querySelector(t.getAttribute('href'));
          var s = tH.querySelector('.product-loop[data-glider="ignore"]');
          if (s) {
            s.setAttribute('data-glider', 'loaded');
            if (s.getAttribute('data-glider') === 'loaded') {
              setTimeout(function() {
                Sliders(container);
              }, 250);
            }
          }
        }
      });
    }
    return Tabbed;
  })();
  theme.Tabbed.prototype = Object.assign({}, theme.Tabbed.prototype, {
    onBlockSelect: function(ev) {    
      var container = this.container;    
      var tI = this.container.querySelectorAll('.tabs-id-' + this.sectionId + ' a');      
      var tB = this.container.querySelectorAll('.tab-body-id-' + this.sectionId);
      var tT = ev.target;
      var tH = this.container.querySelector(ev.target.getAttribute('href'));      
      Tabs(container);
      if (tI) {
        tI.forEach(function(t) {
          t.classList.remove('first');
          t.setAttribute('tabindex','-1');
          t.removeAttribute('aria-selected');
        });
        tB.forEach(function(t) {
          t.classList.add('hide');
          t.hidden = true;
          var s = t.querySelector('.product-loop[data-glider="loaded"]');
          if (s) {
            s.setAttribute('data-glider', 'ignore');
          }
        });
      }
      tT.classList.add('first');
      tT.removeAttribute('tabindex');
      tT.setAttribute('aria-selected','true');      
      tH.classList.remove('hide');
      tH.hidden = false;     
      var loop = tH.querySelector('.product-loop[data-glider="unloaded"]');
      if (loop) {
        loop.setAttribute('data-glider', 'loaded');
        if (loop.getAttribute('data-glider') === 'loaded') {
          Sliders(container);
        }
      }
      var tC = document.getElementById('tabs-carousel-' + this.sectionId);
      if (tC) {        
        var mSI = parseInt(ev.target.getAttribute('data-gslide'));
        Glider(tC).scrollItem(parseInt(mSI));
      }
    }
  });    
  theme.Slider = (function() {
    function Slider(container) {
      var sectionId = container.getAttribute('data-section-id');
      var Carousel = document.getElementById('glider-carousel-' + sectionId);
      var type = container.getAttribute('data-carousel-type');      
      this.container = container;      
      this.Carousel = Carousel;
      this.type = type;      
    }
    return Slider;
  })();
  theme.Slider.prototype = Object.assign({}, theme.Slider.prototype, {
    onBlockSelect: function(ev) {
      if (this.Carousel) {
        if (this.type == 'slideshow') {
          Slideshow(this.container);
        } else {
          Sliders(this.container);
        }
        var mSI = parseInt(ev.target.getAttribute('data-gslide'));        
        Glider(this.Carousel).scrollItem(parseInt(mSI));
        if (this.Carousel.getAttribute('data-glider-autorotate') == 'true') {          
          clearInterval(theme.sI);
        };        
      }      
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var sections = new theme.Sections();
  sections.register('header', theme.Header);
  sections.register('popup', theme.PopUp);
  sections.register('collection_page', theme.Collection);
  sections.register('product_page', theme.Product);
  sections.register('store_availability', theme.StoreAvailability);
  sections.register('cart_page', theme.CartPage);
  sections.register('search_page', theme.Search);
  sections.register('contact_page', theme.Contact);
  sections.register('password_page', theme.Password);
  sections.register('error_page', theme.NotFound);
  sections.register('carousel', theme.Slider);
  sections.register('tabbed', theme.Tabbed);
  sections.register('slideshow', theme.Slider);
  if (theme.settings.quickView) {
    Quick();
  };
  if (theme.settings.compare) {
    CompareProducts();
  };
  Wrap(); 
  document.querySelectorAll('.form-validation').forEach(formElement => {
    ValidForm(formElement, {
      invalidClass: 'invalid',
      validationErrorClass: 'error',
      validationErrorParentClass: 'has-error',
      errorPlacement: 'after',
      customMessages: {
        badInput: theme.language.general_validation_match,
        patternMismatch: theme.language.general_validation_match,
        rangeOverflow: theme.language.general_validation_value_less,
        rangeUnderflow: theme.language.general_validation_value_greater,
        stepMismatch: theme.language.general_validation_error,
        tooLong: theme.language.general_validation_characters_exceed,
        tooShort: theme.language.general_validation_characters_min,
        typeMismatch: theme.language.general_validation_match,
        valueMissing: theme.language.general_validation_required,
        emailMismatch: theme.language.general_validation_valid_email,
        urlMismatch: theme.language.general_validation_valid_url,
        numberMismatch: theme.language.general_validation_valid_number
      }
    })
  });
  document.addEventListener('touchstart', function() {theme.Helpers.setTouch();},{once:true});
  if (window.SPR) {
    SPR.initDomEls();
    SPR.loadBadges();
  }
});

//	Micromodal.js - 0.4.6 | https://micromodal.vercel.app/
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).MicroModal=t()}(this,(function(){"use strict";function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function t(e){return function(e){if(Array.isArray(e))return o(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return o(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}var n,i,a,r,s,l=(n=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'],i=function(){function o(e){var n=e.targetModal,i=e.triggers,a=void 0===i?[]:i,r=e.onShow,s=void 0===r?function(){}:r,l=e.onClose,c=void 0===l?function(){}:l,d=e.openTrigger,u=void 0===d?"data-micromodal-trigger":d,f=e.closeTrigger,h=void 0===f?"data-micromodal-close":f,v=e.openClass,m=void 0===v?"is-open":v,g=e.disableScroll,b=void 0!==g&&g,y=e.disableFocus,p=void 0!==y&&y,w=e.awaitCloseAnimation,E=void 0!==w&&w,k=e.awaitOpenAnimation,M=void 0!==k&&k,C=e.debugMode,A=void 0!==C&&C;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),this.modal=document.getElementById(n),this.config={debugMode:A,disableScroll:b,openTrigger:u,closeTrigger:h,openClass:m,onShow:s,onClose:c,awaitCloseAnimation:E,awaitOpenAnimation:M,disableFocus:p},a.length>0&&this.registerTriggers.apply(this,t(a)),this.onClick=this.onClick.bind(this),this.onKeydown=this.onKeydown.bind(this)}var i,a,r;return i=o,(a=[{key:"registerTriggers",value:function(){for(var e=this,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];o.filter(Boolean).forEach((function(t){t.addEventListener("click",(function(t){return e.showModal(t)}))}))}},{key:"showModal",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(this.activeElement=document.activeElement,this.modal.setAttribute("aria-hidden","false"),this.modal.classList.add(this.config.openClass),this.scrollBehaviour("disable"),this.addEventListeners(),this.config.awaitOpenAnimation){var o=function t(){e.modal.removeEventListener("animationend",t,!1),e.setFocusToFirstNode()};this.modal.addEventListener("animationend",o,!1)}else this.setFocusToFirstNode();this.config.onShow(this.modal,this.activeElement,t)}},{key:"closeModal",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=this.modal;if(this.modal.setAttribute("aria-hidden","true"),this.removeEventListeners(),this.scrollBehaviour("enable"),this.activeElement&&this.activeElement.focus&&this.activeElement.focus(),this.config.onClose(this.modal,this.activeElement,e),this.config.awaitCloseAnimation){var o=this.config.openClass;this.modal.addEventListener("animationend",(function e(){t.classList.remove(o),t.removeEventListener("animationend",e,!1)}),!1)}else t.classList.remove(this.config.openClass)}},{key:"closeModalById",value:function(e){this.modal=document.getElementById(e),this.modal&&this.closeModal()}},{key:"scrollBehaviour",value:function(e){if(this.config.disableScroll){var t=document.querySelector("body");switch(e){case"enable":Object.assign(t.style,{overflow:""});break;case"disable":Object.assign(t.style,{overflow:"hidden"})}}}},{key:"addEventListeners",value:function(){this.modal.addEventListener("touchstart",this.onClick),this.modal.addEventListener("click",this.onClick),document.addEventListener("keydown",this.onKeydown)}},{key:"removeEventListeners",value:function(){this.modal.removeEventListener("touchstart",this.onClick),this.modal.removeEventListener("click",this.onClick),document.removeEventListener("keydown",this.onKeydown)}},{key:"onClick",value:function(e){e.target.hasAttribute(this.config.closeTrigger)&&this.closeModal(e)}},{key:"onKeydown",value:function(e){27===e.keyCode&&this.closeModal(e),9===e.keyCode&&this.retainFocus(e)}},{key:"getFocusableNodes",value:function(){var e=this.modal.querySelectorAll(n);return Array.apply(void 0,t(e))}},{key:"setFocusToFirstNode",value:function(){var e=this;if(!this.config.disableFocus){var t=this.getFocusableNodes();if(0!==t.length){var o=t.filter((function(t){return!t.hasAttribute(e.config.closeTrigger)}));o.length>0&&o[0].focus(),0===o.length&&t[0].focus()}}}},{key:"retainFocus",value:function(e){var t=this.getFocusableNodes();if(0!==t.length)if(t=t.filter((function(e){return null!==e.offsetParent})),this.modal.contains(document.activeElement)){var o=t.indexOf(document.activeElement);e.shiftKey&&0===o&&(t[t.length-1].focus(),e.preventDefault()),!e.shiftKey&&t.length>0&&o===t.length-1&&(t[0].focus(),e.preventDefault())}else t[0].focus()}}])&&e(i.prototype,a),r&&e(i,r),o}(),a=null,r=function(e){if(!document.getElementById(e))return console.warn("MicroModal: ❗Seems like you have missed %c'".concat(e,"'"),"background-color: #f8f9fa;color: #50596c;font-weight: bold;","ID somewhere in your code. Refer example below to resolve it."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<div class="modal" id="'.concat(e,'"></div>')),!1},s=function(e,t){if(function(e){e.length<=0&&(console.warn("MicroModal: ❗Please specify at least one %c'micromodal-trigger'","background-color: #f8f9fa;color: #50596c;font-weight: bold;","data attribute."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<a href="#" data-micromodal-trigger="my-modal"></a>'))}(e),!t)return!0;for(var o in t)r(o);return!0},{init:function(e){var o=Object.assign({},{openTrigger:"data-micromodal-trigger"},e),n=t(document.querySelectorAll("[".concat(o.openTrigger,"]"))),r=function(e,t){var o=[];return e.forEach((function(e){var n=e.attributes[t].value;void 0===o[n]&&(o[n]=[]),o[n].push(e)})),o}(n,o.openTrigger);if(!0!==o.debugMode||!1!==s(n,r))for(var l in r){var c=r[l];o.targetModal=l,o.triggers=t(c),a=new i(o)}},show:function(e,t){var o=t||{};o.targetModal=e,!0===o.debugMode&&!1===r(e)||(a&&a.removeEventListeners(),(a=new i(o)).showModal())},close:function(e){e?a.closeModalById(e):a.closeModal()}});return window.MicroModal=l,l}));
//	ValidForm - 1.1.1 | https://github.com/Pageclip/valid-form | Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){"use strict";var _validForm=require("./src/valid-form");var _validForm2=_interopRequireDefault(_validForm);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}window.ValidForm=_validForm2.default;window.ValidForm.toggleInvalidClass=_validForm.toggleInvalidClass;window.ValidForm.handleCustomMessages=_validForm.handleCustomMessages;window.ValidForm.handleCustomMessageDisplay=_validForm.handleCustomMessageDisplay},{"./src/valid-form":3}],2:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.clone=clone;exports.defaults=defaults;exports.insertAfter=insertAfter;exports.insertBefore=insertBefore;exports.forEach=forEach;exports.debounce=debounce;function clone(obj){var copy={};for(var attr in obj){if(obj.hasOwnProperty(attr))copy[attr]=obj[attr]}return copy}function defaults(obj,defaultObject){obj=clone(obj||{});for(var k in defaultObject){if(obj[k]===undefined)obj[k]=defaultObject[k]}return obj}function insertAfter(refNode,nodeToInsert){var sibling=refNode.nextSibling;if(sibling){var _parent=refNode.parentNode;_parent.insertBefore(nodeToInsert,sibling)}else{parent.appendChild(nodeToInsert)}}function insertBefore(refNode,nodeToInsert){var parent=refNode.parentNode;parent.insertBefore(nodeToInsert,refNode)}function forEach(items,fn){if(!items)return;if(items.forEach){items.forEach(fn)}else{for(var i=0;i<items.length;i++){fn(items[i],i,items)}}}function debounce(ms,fn){var timeout=void 0;var debouncedFn=function debouncedFn(){clearTimeout(timeout);timeout=setTimeout(fn,ms)};return debouncedFn}},{}],3:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.toggleInvalidClass=toggleInvalidClass;exports.handleCustomMessages=handleCustomMessages;exports.handleCustomMessageDisplay=handleCustomMessageDisplay;exports.default=validForm;var _util=require("./util");function toggleInvalidClass(input,invalidClass){input.addEventListener("invalid",function(){input.classList.add(invalidClass)});input.addEventListener("input",function(){if(input.validity.valid){input.classList.remove(invalidClass)}})}var errorProps=["badInput","patternMismatch","rangeOverflow","rangeUnderflow","stepMismatch","tooLong","tooShort","typeMismatch","valueMissing","customError"];function getCustomMessage(input,customMessages){customMessages=customMessages||{};var localErrorProps=[input.type+"Mismatch"].concat(errorProps);var validity=input.validity;for(var i=0;i<localErrorProps.length;i++){var prop=localErrorProps[i];if(validity[prop]){return input.getAttribute("data-"+prop)||customMessages[prop]}}}function handleCustomMessages(input,customMessages){function checkValidity(){var message=input.validity.valid?null:getCustomMessage(input,customMessages);input.setCustomValidity(message||"")}input.addEventListener("input",checkValidity);input.addEventListener("invalid",checkValidity)}function handleCustomMessageDisplay(input,options){var validationErrorClass=options.validationErrorClass,validationErrorParentClass=options.validationErrorParentClass,errorPlacement=options.errorPlacement;function checkValidity(options){var insertError=options.insertError;var parentNode=input.parentNode;var errorNode=parentNode.querySelector("."+validationErrorClass)||document.createElement("label");if(!input.validity.valid&&input.validationMessage){errorNode.className=validationErrorClass;errorNode.textContent=input.validationMessage;if(insertError){errorPlacement==="before"?(0,_util.insertBefore)(input,errorNode):(0,_util.insertAfter)(input,errorNode);parentNode.classList.add(validationErrorParentClass)}}else{parentNode.classList.remove(validationErrorParentClass);errorNode.remove()}}input.addEventListener("input",function(){checkValidity({insertError:false})});input.addEventListener("invalid",function(e){e.preventDefault();checkValidity({insertError:true})})}var defaultOptions={invalidClass:"invalid",validationErrorClass:"validation-error",validationErrorParentClass:"has-validation-error",customMessages:{},errorPlacement:"before"};function validForm(element,options){if(!element||!element.nodeName){throw new Error("First arg to validForm must be a form, input, select, or textarea")}var inputs=void 0;var type=element.nodeName.toLowerCase();options=(0,_util.defaults)(options,defaultOptions);if(type==="form"){inputs=element.querySelectorAll("input, select, textarea");focusInvalidInput(element,inputs)}else if(type==="input"||type==="select"||type==="textarea"){inputs=[element]}else{throw new Error("Only form, input, select, or textarea elements are supported")}validFormInputs(inputs,options)}function focusInvalidInput(form,inputs){var focusFirst=(0,_util.debounce)(100,function(){var invalidNode=form.querySelector(":invalid");if(invalidNode)invalidNode.focus()});(0,_util.forEach)(inputs,function(input){return input.addEventListener("invalid",focusFirst)})}function validFormInputs(inputs,options){var invalidClass=options.invalidClass,customMessages=options.customMessages;(0,_util.forEach)(inputs,function(input){toggleInvalidClass(input,invalidClass);handleCustomMessages(input,customMessages);handleCustomMessageDisplay(input,options)})}},{"./util":2}]},{},[1]);