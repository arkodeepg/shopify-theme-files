function ProductOptionSelection(){
  !(function () {
    (Shopify.Product = function (t) {
      Shopify.isDefined(t) && this.update(t);
    }),
    (Shopify.Product.prototype.update = function (t) {
    for (property in t) this[property] = t[property];
  }),
    (Shopify.Product.prototype.optionNames = function () {
    return "Array" == Shopify.getClass(this.options) ? this.options : [];
  }),
    (Shopify.Product.prototype.optionValues = function (t) {
    if (!Shopify.isDefined(this.variants)) return null;
    var e = Shopify.map(this.variants, function (e) {
      var n = "option" + (t + 1);
      return void 0 == e[n] ? null : e[n];
    });
    return null == e[0] ? null : Shopify.uniq(e);
  }),
    (Shopify.Product.prototype.getVariant = function (t) {
      var e = null;
      return t.length != this.options.length
      ? e
      : (Shopify.each(this.variants, function (n) {
        for (var i = !0, r = 0; r < t.length; r++) {
          var o = "option" + (r + 1);
          n[o] != t[r] && (i = !1);
        }
        if (1 == i) return void (e = n);
      }),e);
    }),
    (Shopify.Product.prototype.getVariantById = function (t) {
      for (var e = 0; e < this.variants.length; e++) {
        var n = this.variants[e];
        if (t == n.id) return n;
      }
      return null;
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
    }),      
    (Shopify.OptionSelectors = function (t, e) {
      return (
        (this.selectorDivClass = "selector-wrapper"),
        (this.selectorClass = "single-option-selector"),
        (this.variantIdFieldIdSuffix = "-variant-id"),
        (this.variantIdField = null),
        (this.historyState = null),
        (this.selectors = []),
        (this.domIdPrefix = t),
        (this.product = new Shopify.Product(e.product)),
        (this.onVariantSelected = Shopify.isDefined(e.onVariantSelected) ? e.onVariantSelected : function () {}),
        (this.setActiveThumbnail = e.setActiveThumbnail),
        (this.switchProductImage = e.switchProductImage),
        (this.settings = e.settings),
        this.replaceSelector(t),
        this.initDropdown(),
        e.enableHistoryState && (this.historyState = new Shopify.OptionSelectors.HistoryState(this)),
        !0
      );
    }),
    (Shopify.OptionSelectors.prototype.initDropdown = function () {
      var t = { initialLoad: !0 },
          e = this.selectVariantFromDropdown(t);      
      if (!e) {
        var n = this;
        setTimeout(function () {
          n.selectVariantFromParams(t) || n.fireOnChangeForFirstDropdown.call(n, t);
        });
      }
    }),
    (Shopify.OptionSelectors.prototype.fireOnChangeForFirstDropdown = function (t) {
      document.getElementById(this.domIdPrefix + '-option-0').onchange(e)
    }),
    (Shopify.OptionSelectors.prototype.selectVariantFromParamsOrDropdown = function (t) {
      var e = this.selectVariantFromParams(t);
      e || this.selectVariantFromDropdown(t);
    }),
    (Shopify.OptionSelectors.prototype.replaceSelector = function (t) {
      var e = document.getElementById(t),
          n = e.parentNode;
      Shopify.each(this.buildSelectors(), function (t) {}),
        (this.variantIdField = e);
    }),
    (Shopify.OptionSelectors.prototype.selectVariantFromDropdown = function (t) {
      var e = document.getElementById(this.domIdPrefix).querySelector("[selected]");
      if ((e || (e = document.getElementById(this.domIdPrefix).querySelector('[selected="selected"]')), !e)) return !1;
      var n = e.value;
      return this.selectVariant(n, t);
    }),
    (Shopify.OptionSelectors.prototype.selectVariantFromParams = function (t) {
      var e = Shopify.urlParam("variant");
      return this.selectVariant(e, t);
    }),
    (Shopify.OptionSelectors.prototype.selectVariant = function (t, e) {
      var n = this.product.getVariantById(t);
      if (null == n) return !1;
      for (var i = 0; i < this.selectors.length; i++) {
        var r = document.getElementById(this.domIdPrefix + '-option-' + i),
            o = r.getAttribute('data-option'),
            s = n[o];
        null != s && this.optionExistInSelect(r, s) && (r.value = s);
      }
      return "undefined" != typeof jQuery ? jQuery(document.getElementById(this.domIdPrefix + '-option-0')).trigger("change", e) : document.getElementById(this.domIdPrefix + '-option-0').onchange(e), !0;
    }),
    (Shopify.OptionSelectors.prototype.optionExistInSelect = function (t, e) {      
      for (var n = 0; n < t.options.length; n++) if (t.options[n].value == e) return !0;
    }),
    (Shopify.OptionSelectors.prototype.buildSelectors = function () {
      for (var t = 0; t < this.product.optionNames().length; t++) {
        var e = new Shopify.SingleOptionSelector(this, t, this.product.optionNames()[t], this.product.optionValues(t));
        (e.disabled = !1), this.selectors.push(e);
      }
      var n = this.selectorDivClass,
          i = this.product.optionNames(),
          r = Shopify.map(this.selectors, function (t) {});
      return r;
    }),
    (Shopify.OptionSelectors.prototype.selectedValues = function () {
      for (var t = [], e = 0; e < this.selectors.length; e++) {
        var n = document.getElementById(this.domIdPrefix + '-option-' + e).value;
        t.push(n);
      }
      return t;
    }),
    (Shopify.OptionSelectors.prototype.updateSelectors = function (t, e) {
      var n = this.selectedValues(),
          i = this.product.getVariant(n);
      i ? ((this.variantIdField.disabled = !1), (this.variantIdField.value = i.id)) : (this.variantIdField.disabled = !0), this.onVariantSelected(i, this, e), null != this.historyState && this.historyState.onVariantChange(i, this, e);
    }),
    (Shopify.OptionSelectorsFromDOM = function (t, e) {
      var n = e.optionNames || [],
          i = e.priceFieldExists || !0,
          r = e.delimiter || "/",
          o = this.createProductFromSelector(t, n, i, r);
      (e.product = o), Shopify.OptionSelectorsFromDOM.baseConstructor.call(this, t, e);
    }),
    Shopify.extend(Shopify.OptionSelectorsFromDOM, Shopify.OptionSelectors),(Shopify.OptionSelectorsFromDOM.prototype.createProductFromSelector = function (t, e, n, i) {
      if (!Shopify.isDefined(n)) var n = !0;
      if (!Shopify.isDefined(i)) var i = "/";
      var r = document.getElementById(t),
          o = r.childNodes,
          s = (r.parentNode, e.length),
          a = [];
      Shopify.each(o, function (t, r) {
        if (1 == t.nodeType && "option" == t.tagName.toLowerCase()) {
          var o = t.innerHTML.split(new RegExp("\\s*\\" + i + "\\s*"));
          0 == e.length && (s = o.length - (n ? 1 : 0));
          var l = o.slice(0, s),
              c = n ? o[s] : "",
              u = (t.getAttribute("value"), { available: !t.disabled, id: parseFloat(t.value), price: c, option1: l[0], option2: l[1], option3: l[2] });
          a.push(u);
        }
      });
      var l = { variants: a };
      if (0 == e.length) {
        l.options = [];
        for (var c = 0; c < s; c++) l.options[c] = "option " + (c + 1);
      } else l.options = e;
      return l;
    }),
    (Shopify.SingleOptionSelector = function (t, e, n, i) {
      return (
        document.getElementById(t.domIdPrefix + '-option-' + e).onchange = function(n,i){
          (i = i || {}), t.updateSelectors(e, i);
        },!0
      );
    }),
    (Shopify.Image = {
      preload: function (t, e) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          this.loadImage(this.getSizedImageUrl(i, e));
        }
      },
      loadImage: function (t) {
        new Image().src = t;
      },
      switchImage: function (t, e, n) {
        if (t && e) {
          var i = this.imageSize(e.src),
              r = this.getSizedImageUrl(t.src, i);
          n ? n(r, t, e) : (e.src = r);
        }
      },
      imageSize: function (t) {
        var e = t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
        return null !== e ? e[1] : null;
      },
      getSizedImageUrl: function (t, e) {
        if (null == e) return t;
        if ("master" == e) return this.removeProtocol(t);
        var n = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
        if (null != n) {
          var i = t.split(n[0]),
              r = n[0];
          return this.removeProtocol(i[0] + "_" + e + r);
        }
        return null;
      },
      removeProtocol: function (t) {
        return t.replace(/http(s)?:/, "");
      },
    }),
    (Shopify.OptionSelectors.HistoryState = function (t) {
      this.browserSupports() && this.register(t);
    }),
    (Shopify.OptionSelectors.HistoryState.prototype.register = function (t) {
      window.addEventListener("popstate", function (e) {
        t.selectVariantFromParamsOrDropdown({ popStateCall: !0 });
      });
    }),
    (Shopify.OptionSelectors.HistoryState.prototype.onVariantChange = function (t, e, n) {
      this.browserSupports() && (!t || n.initialLoad || n.popStateCall || Shopify.setParam("variant", t.id));
    }),
    (Shopify.OptionSelectors.HistoryState.prototype.browserSupports = function () {
      return window.history && window.history.replaceState;
    });
  })();
}
function ProductOptionsJS(container){
  var sectionId = container.getAttribute('data-section-id'),
      sectionType = container.getAttribute('data-section-type'),
      productType = container.getAttribute('data-product-type'),
      pJ = JSON.parse(document.getElementById('ProductJson-' + sectionId).innerHTML),
      pS = 'product-select-' + sectionId,
      srfc = container.querySelector('.product-single__store-availability-container'),
      zm = container.getAttribute('data-zoom'),
      mzm = container.getAttribute('data-mobile-zoom');
  if(productType != 'quick' && srfc){
    theme.StoreAvailabilityLoad(container);
  };
  var Shopify = Shopify || {};
  Shopify.arrayIncludes = function(e, t) {
    for (var n = 0; n < e.length; n++)
      if (e[n] == t) return !0;
    return !1
  }, Shopify.uniq = function(e) {
    for (var t = [], n = 0; n < e.length; n++) Shopify.arrayIncludes(t, e[n]) || t.push(e[n]);
    return t
  }
  Shopify.optionsMap = {};
  var selectors = {
    sos0: '#product-select-' + sectionId + '-option-0',
    sos1: '#product-select-' + sectionId + '-option-1',
    sos2: '#product-select-' + sectionId + '-option-2'
  };
  Shopify.updateOptionsInSelector = function(selectorIndex) {
    switch (selectorIndex) {
      case 0:
        var key = 'root';
        var selector = document.querySelector(selectors.sos0);
        break;
      case 1:
        var key = document.querySelector(selectors.sos0).value;
        var selector = document.querySelector(selectors.sos1);
        break;
      case 2:
        var key = document.querySelector(selectors.sos0).value;  
        key += ' / ' + document.querySelector(selectors.sos1).value;
        var selector = document.querySelector(selectors.sos2);
    }
    var initialValue = selector.value;
    selector.innerHTML = '';
    var availableOptions = Shopify.optionsMap[key];          
    for (var i=0; i<availableOptions.length; i++) {
      var option = availableOptions[i];
      var newOption = document.createElement('option');
      newOption.value = option;
      newOption.text  = option;
      selector.appendChild(newOption);
    }    
    var swatchElements = document.querySelectorAll('#product-id-' + sectionId + ' form[action="/cart/add"] .swatch[data-option-index="' + selectorIndex + '"] .swatch-element');
    swatchElements.forEach(function(swatchElement) {        
      var itemradio = swatchElement.querySelector('input');
      itemradio.checked = false;
      if (availableOptions.findIndex(x => x === swatchElement.getAttribute('data-value')) !== -1) {
        swatchElement.style.display = '';
        itemradio.disabled = false;
      } else {
        swatchElement.style.display = 'none';
        itemradio.disabled = true;
      }
    }); 
    if (availableOptions.indexOf(initialValue, availableOptions) !== -1) {
      selector.value = initialValue;
    }
    selector.dispatchEvent(new Event('change')); 
  };
  Shopify.linkOptionSelectors = function(product) {
    for (var i=0; i<product.variants.length; i++) {
      var variant = product.variants[i];
      if (variant) {
        Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
        Shopify.optionsMap['root'].push(variant.option1);
        Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
        if (product.options.length > 1) {
          var key = variant.option1;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option2);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
        if (product.options.length === 3) {
          var key = variant.option1 + ' / ' + variant.option2;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option3);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
      }
    }
    Shopify.updateOptionsInSelector(0);
    if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    document.querySelector(selectors.sos0).addEventListener('change', function(){
      Shopify.updateOptionsInSelector(1);
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
      return true;
    });
    document.querySelector(selectors.sos1).addEventListener('change', function(){
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
      return true;
    });
  };
  if (pJ.available && pJ.options.length > 1) {
    var addToCartForm = document.querySelector('#product-id-' + sectionId + ' form[data-product-form]');
    if (window.MutationObserver && addToCartForm.length) {
      if (typeof observer === 'object' && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
      var config = {childList: true, subtree: true};
      var observer = new MutationObserver(function() {
        Shopify.linkOptionSelectors(JSON.parse(document.getElementById('ProductJson-' + sectionId).innerHTML));
        observer.disconnect();
      });  
      observer.observe(addToCartForm, config);
    }
  }
  if (pJ.variants.length > 1) {
    var variantImages = {},
        thumbnails,
        variant,
        variantImage,
        opt_key,
        opt_val,
        loop_index,
        vars = pJ.variants,
        opts = pJ.options;
    vars.forEach(function(v) {
      variant = v;
      if ( typeof variant.featured_image !== 'undefined' && variant.featured_image !== null ) {
        variantImage =  variant.featured_image.src.split('?')[0].replace(/http(s)?:/,'');
        variantImages[variantImage] = variantImages[variantImage] || {};
        var opts = v.options
        opts.forEach(function(o,i) {
          opt_key = 'option-'+i;
          opt_val = o;
          if (typeof variantImages[variantImage][opt_key] === 'undefined') {
            variantImages[variantImage][opt_key] = opt_val;
          }
          else {
            var oldValue = variantImages[variantImage][opt_key];
            if ( oldValue !== null && oldValue !== opt_val )  {
              variantImages[variantImage][opt_key] = null;
            }
          }
        });
      }
    });
    var thumbnails = document.querySelectorAll('#product-id-' + sectionId + ' .thumbs button');
    if (!thumbnails) return false;
    thumbnails.forEach(function(thumbnail) {
      thumbnail.addEventListener('click', function(ev){
        var thumb = this.querySelector('img[data-source].lazyload');
        var image = thumb.getAttribute('data-source').split('?')[0].replace(/(_1x)/,'');
        if (typeof variantImages[image] !== 'undefined') {
          opts.forEach(function(o,i) {
            var swatches = document.querySelectorAll('#product-id-' + sectionId + ' .swatch-element');
            swatches.forEach(function(swatch) {
              swatch.classList.remove('var_hover');
            });
            loop_index = 'option-' + i;
            if (variantImages[image][loop_index] !== null) {
              var index = i
              var sos = document.querySelector('#product-select-' + sectionId + '-option-' + index);
              sos.value = variantImages[image][loop_index];
              sos.dispatchEvent(new Event('change'));
            }
          });
        }
        ev.preventDefault();
      }, false);
    });
  };
  container.addEventListener('input', function (e) {    
    // Variant change
    if (!e.target.classList.contains('selector')) return;
    var optionIndex = e.target.closest('.selectors'),
        vMF = container.querySelectorAll('.variant_metafields');
    if (optionIndex) {
      var optionIndexAttr = optionIndex.getAttribute('data-option-index'),
          optionValue = e.target.value,
          formSOS = document.getElementById('product-select-' + sectionId + '-option-' + optionIndexAttr);
      formSOS.value = optionValue;
      formSOS.dispatchEvent(new Event('change'));
      if (vMF.length > 0) {
        var e = document.getElementById(pS),
            value = e.options[e.selectedIndex].value;
        fetch(container.dataset.href + '?variant=' + value + '&section_id=' + sectionId)
        .then(function(r) {
          return r.text();
        }).then(function(j) {
          const htmlDocument = new DOMParser().parseFromString(j, 'text/html');
          vMF.forEach(function(v) {
            var nV = v.getAttribute('id'),
                section = htmlDocument.querySelector('#' + nV);
            if (!section) {
              return;
            }
            v.innerHTML = section.innerHTML;
          });        
        }).catch(function(err) {
          console.error('!: ' + err)
        });
      };
    }
    if(productType != 'quick' && srfc){
      theme.StoreAvailabilityLoad(container);
    };    
  }, false);  
  if((mzm == 'false') && (theme.detectmob == true)){
    theme.mobilezoom = false;
  } else {
    theme.mobilezoom = true;
  }
  if((zm == 'true') && (theme.mobilezoom == true)){
    const el = document.querySelectorAll('#main-product-image-' + sectionId + ' .drift img');
    el.forEach(function(e) {
      new Drift(e, {
        paneContainer: e.closest('.drift'),
        inlinePane: 1,
    	zoomFactor: 2,
      });
      var c = e.closest('.drift'),
          btn = c.querySelector('button');
      if (theme.detectmob == true) { 
        btn.onclick = function(ev){
          c.classList.toggle('disabled');
        } 
      } else {        
        c.classList.remove('disabled');
      }
    });
  }
};
function ProductSelectCallback(container) {
  var sectionId = container.getAttribute('data-section-id'),
      atc = container.getAttribute('data-atc'),
      fI = container.getAttribute('data-image'),
      fIa = container.getAttribute('data-image-aspect'),
      pJ = JSON.parse(document.getElementById('ProductJson-' + sectionId).innerHTML),
      pS = 'product-select-' + sectionId,
      pP = document.getElementById('price-' + sectionId),
      pSs = document.getElementById('savings-' + sectionId),
      pC = document.getElementById('compare-' + sectionId),
      pA = document.getElementById('add-to-cart-' + sectionId),
      pSk = document.getElementById('error_' + sectionId),
      pQ = document.getElementById('updates_' + sectionId),
      pI = document.getElementById('inventory-' + sectionId),
      pO = document.getElementById('offer-' + sectionId),
      pL = document.getElementById('product-logistics-' + sectionId);
      if (pL) {
        var pV = pL.querySelector('.vendor'),
            pSr2 = pL.querySelector('.separator_2'),
            pSKU = document.getElementById('sku-' + sectionId),
            pSr3 = pL.querySelector('.separator_3'),
            pBAR = document.getElementById('barcode-' + sectionId);
      }
  if (pI) {
    var pIC = parseInt(document.getElementById('inventory-' + sectionId).getAttribute('data-inv'));
  }
  var selectCallback = function(variant, selector) {
    var pID = document.getElementById('product-select-' + sectionId),
        pIA = parseInt(pID.options[pID.selectedIndex].getAttribute('data-inv')),
        pII = pID.options[pID.selectedIndex].getAttribute('data-inc'),
        pIID = pID.options[pID.selectedIndex].getAttribute('data-inc_date'),
        free = theme.language.products_product_free;
    if(variant){
      var cap = Shopify.formatMoney(variant.compare_at_price,theme.moneyFormat),
          dif = Shopify.formatMoney(variant.compare_at_price - variant.price,theme.moneyFormat).replace(/((\,00)|(\.00))$/g, ''),
          price = Shopify.formatMoney(variant.price,theme.moneyFormat);
    }
    if (variant && variant.available == true) {
      if (pP) {
        if(variant.compare_at_price > variant.price){
          if(variant.price == '0') {
            pP.innerHTML = free + ' <del>' + cap + '</del>';
            pC.innerHTML = dif;
            pSs.classList.remove('hidden');
          } else {
            pP.innerHTML = price + ' <del>' + cap + '</del>';
            pC.innerHTML = dif;
            pSs.classList.remove('hidden');
          }                                          
        } else if(variant.price == '0') {
          pP.innerHTML = free;
          pSs.classList.add('hidden');
        } else {
          pP.innerHTML = price;
          pSs.classList.add('hidden');
        }
      }
      if (pA) {        
        var pSm = pA.closest('.purchase-section').getAttribute('data-smart');
        pA.innerText = atc;
        if (pSm == 'true') {
          pA.classList.add('outline');
          pA.classList.remove('disabled');
        } else {
          pA.classList.remove('disabled','outline');
        }
        pA.removeAttribute('disabled');
      }
      if (pSk) {
        pSk.style.display = 'none';
      }
      if (pQ) {
        pQ.value = 1;
      }
    } else if (variant && variant.available == false) {
      if (pP) {
        if(variant.compare_at_price > variant.price){
          if(variant.price == '0') {
            pP.innerHTML = free + ' <del>' + cap + '</del>';
            pC.innerHTML = dif;
            pSs.classList.remove('hidden');
          } else {
            pP.innerHTML = price + ' <del>' + cap + '</del>';
            pC.innerHTML = dif;
            pSs.classList.remove('hidden');
          }                                          
        } else if(variant.price == '0') {
          pP.innerHTML = free;
          pC.innerHTML = dif;
          pSs.classList.add('hidden');
        } else {
          pP.innerHTML = price;
          pSs.classList.add('hidden');
        }
      }
      if (pA) {
        pA.innerText = theme.language.products_product_sold_out;
        pA.classList.add('disabled','outline');
        pA.setAttribute('disabled', true);
      }
      if (pSk) {
        pSk.style.display = 'none';
      }
      if (pQ) {
        pQ.value = 0;
      }
    } else {
      if (pA) {
        pA.innerText = theme.language.products_product_disabled_add_to_cart;
        pA.classList.add('disabled','outline');
        pA.setAttribute('disabled', true);
      }
      var swatch = container.querySelectorAll('.swatch-element'),
          label = container.querySelectorAll('.selectors legend span');
      if (swatch) {
        swatch.forEach(function(s) {
          s.classList.remove('active');
          s.classList.remove('soldout');
        });
      };      
      label.forEach(function(l) {
        l.textContent = '';
      });      
      if (pI) {
        pI.textContent = '';
      }
      if (pP) {
        pP.textContent = '';
      }
      if (pSKU) {
        pSKU.textContent = '';
      }
      if (pBAR) {
        pBAR.textContent = '';
      }
      if (pSr2) {
        pSr2.classList.add('hidden');
      }
      if (pSr3) {
        pSr3.classList.add('hidden');
      }
      if (pSs) {
        pSs.classList.add('hidden');
      }
      if (pSk) {
        pSk.style.display = 'none';
      }
      if (pQ) {
        pQ.value = 1;
      }
    }
    if (variant) {
      var form = document.getElementById('add-item-form-' + sectionId),
          lP = form.querySelectorAll('.swatch-element');
      form.classList.remove('var_load');
      lP.forEach(function(l) {
        l.classList.remove('active','soldout');
      });
      for (var i=0,length=variant.options.length; i<length; i++) {
        var swatch = form.querySelector('.swatch[data-option-index="' + i + '"]'),
            label = form.querySelector('.selectors[data-option-index="' + i + '"] label span'),
            legend = form.querySelector('.selectors[data-option-index="' + i + '"] legend span');
        if (label) {
          label.textContent = variant.options[i];
        };
        if (legend) {
          legend.textContent = variant.options[i];
        };
        if (swatch) {
          var opt = variant.options[i].replace(/["\\]/g, '\\$&'),
              labelButton = swatch.querySelector('.swatch-element[data-value="' + opt +'"]'),
              radioButton = swatch.querySelector('input[value="' + opt +'"]');
          if (radioButton) {
            swatch.parentElement.classList.remove('hidden');
            labelButton.classList.add('active');
          }
          if (variant.available == true) {
            labelButton.classList.remove('soldout');
          } else {
            labelButton.classList.add('soldout');
          }
        }
      }
      if (variant.sku) {
        if (pSKU) {
          pL.classList.remove('hidden');
          pSr2.classList.add('hidden');
          pSKU.innerHTML = '<span>' + theme.language.products_product_sku + '</span>' + variant.sku;
          if (pV) {
            pSr2.classList.remove('hidden');
          } else {
            pL.classList.remove('hidden');
          }
        }
      } else {
        if (pSKU) {
          pSKU.textContent = '';
          if (pV) {
            pSr2.classList.add('hidden');
          } else {
            pL.classList.add('hidden');
          }
        }
      }
      if (variant.barcode) {        
        if (pBAR) {      
          pL.classList.remove('hidden');
          pSr3.classList.add('hidden');
          pBAR.innerHTML = '<span>' + theme.language.products_product_bar + '</span>' + variant.barcode;
          if (pSKU && variant.sku || pV) {
            pSr3.classList.remove('hidden');
          } else {
            pL.classList.remove('hidden');
          }
        }
      } else {
        if (pBAR) {
          pBAR.textContent = '';
          if (pV || pSKU && variant.sku) {
            pSr3.classList.add('hidden');
          } else {
            pL.classList.add('hidden');
          }
        }
      }
      if (variant.inventory_management) {
        if (pIA > 0 && pIA < pIC) {
          if (pI) {
            if(pII == 'true') {
              pI.innerHTML = '<h4><span>' + theme.language.products_general_inv_msg_1 + '&nbsp;' + pIA + '&nbsp;' + theme.language.products_general_inv_msg_2 + '</span><span class="error-text"><small><span class="icon icon-bell"></span> ' + pIID + '</small</span></h4>';
            } else {
              pI.innerHTML = '<h4><span>' + theme.language.products_general_inv_msg_1 + '&nbsp;' + pIA + '&nbsp;' + theme.language.products_general_inv_msg_2 + '</span></h4>';
            }
          }
          if (pQ) {
            pQ.setAttribute('min', 1);
          }
        } else if (pIA > pIC) {
          if (pI) {
            pI.innerHTML = '<h4><span>' + theme.language.products_product_available + '</span></h4>';
          }
          if (pQ) {
            pQ.setAttribute('min', 1);
          }
        } else if (pIA < 1) {
          if (variant.available) {
            if (pI) {
              pI.innerHTML = '<h4><span>' + theme.language.products_product_available + '</span></h4>';
            }
            if (pQ) {
              pQ.setAttribute('min', 1);
            }
          } else {
            if (pI) {
              if(pII == 'true') {
                pI.innerHTML = '<h4><span>' + theme.language.products_product_sold_out + '</span><span class="error-text"><small><span class="icon icon-bell"></span> ' + pIID + '</small></span></h4>';
              } else {
                pI.innerHTML = '<h4><span>' + theme.language.products_product_sold_out + '</span></h4>'
              }
            }
            if (pQ) {
              pQ.setAttribute('min', 0);
            }
          }
        } else {
          if (pI) {
            pI.innerHTML = '<h4><span>' + theme.language.products_product_available + '</span></h4>';
          }
          if (pQ) {
            pQ.setAttribute('min', 1);
          }
        }
        if (pIA != null) {
          if (pQ) {
            pQ.setAttribute('max', pIA);
          }
        } else {
          if (pQ) {
            pQ.removeAttribute('max')
          }
        };
      } else {
        if (pI) {
          pI.innerHTML = '<h4><span>' + theme.language.products_product_available + '</span></h4>';
        }
        if (pQ) {
          pQ.removeAttribute('max')
          pQ.setAttribute('min', 1);
        }
      }
      if (variant.unit_price_measurement) {
        if (variant.unit_price_measurement.reference_value != 1) {
          pO.innerHTML = '<h4>' + Shopify.formatMoney(variant.unit_price,theme.moneyFormat) + theme.language.products_general_per + variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit + '</h4>';
          pO.classList.remove('hidden');
        } else {
          pO.innerHTML = '<h4>' + Shopify.formatMoney(variant.unit_price,theme.moneyFormat) + theme.language.products_general_per + variant.unit_price_measurement.reference_unit + '</h4>';
          pO.classList.remove('hidden');
        }
      } else {
        if (pO) {
          pO.textContent = '';
          pO.classList.add('hidden');
        }
      }
      if (variant && variant.featured_media) {
        var nI = variant.featured_media,
            vi = '.variant-image-' + sectionId,
            oIe = container.querySelectorAll(vi),
            nIe = container.querySelector('.variant-image-' + sectionId + '[data-image-id="' + nI.id + '"]'),
            cm = document.querySelector(vi + '.visible');
        cm.dispatchEvent(new CustomEvent('mediaHidden'));
        nIe.dispatchEvent(new CustomEvent('mediaVisible'));
        oIe.forEach(function(o) {
          o.classList.add('hidden'); 
          o.classList.remove('visible')
          o.blur()
        });
        nIe.classList.add('visible')
        nIe.classList.remove('hidden')
      }
    } else {
      if (pSKU) {
        pSKU.textContent = '';        
      }
      if (pBAR) {
        pBAR.textContent = '';        
      }
      if (pI) {
        pI.textContent = '';
      }
      if (pO) {
        pO.textContent = '';
      }
    }
  };  
  new Shopify.OptionSelectors(pS, {
    product: pJ, 
    onVariantSelected: selectCallback, 
    enableHistoryState: container.getAttribute('data-history') === 'true'
  });
  // Based on https://community.shopify.com/c/Shopify-Discussion/How-to-get-recent-viewed-products-in-Shopify-Store-in-any-theme/td-p/887103  
  function RecV() {
    const pA = [];
    let jR,
        jRA,
        jRAS;
    const nP = 5;
    const pD = {
      pID: pJ.id
    } 
    pA.push(pD);
    const cpT = pD.pID; 
    const pDS = JSON.stringify(pA);
    const lD = localStorage.getItem('rVP');
    if(lD == null) { 
      localStorage.setItem('rVP', pDS);
    } else if (lD != null ) {
      const opD = localStorage.getItem('rVP');
      const cpD = (opD.match(/pID/g) || []).length;
      const rP =  opD.includes(cpT);
      if (cpD < nP && rP == false) {
        jR = JSON.parse(opD);
        jRA = jR.concat(pA);
        jRAS = JSON.stringify(jRA);
        localStorage.setItem('rVP', jRAS);
      }
      else if (cpD >= nP && rP == false) {
        jR = JSON.parse(opD);
        jR.shift();
        jRA = jR.concat(pA);
        jRA =  JSON.stringify(jRA);
        localStorage.setItem('rVP', jRA);
      }
    }
  }
  RecV();
};

theme.StoreAvailabilityLoad = function (container) {
  var sectionId = container.getAttribute('data-section-id'),
      sectionType = container.getAttribute('data-section-type');
  var pJ = document.getElementById('ProductJson-' + sectionId),
      pS = 'product-select-' + sectionId;
  if (!pJ || !pJ.innerHTML.length) {
    return;
  }
  this.productSingleObject = JSON.parse(pJ.innerHTML);
  this.container = container;
  var sectionId = container.getAttribute('data-section-id');
  this.selectors = {
    storeAvailabilityContainer: '[data-store-availability-container]',
    originalSelectorId: '#product-select-' + sectionId,
    singleOptionSelector: 'form.product-form-' + sectionId + ' .single-option-selector'
  };
  this.storeAvailabilityContainer = container.querySelector(
    this.selectors.storeAvailabilityContainer
  );
  if (this.storeAvailabilityContainer) {
    this.storeAvailability = new theme.StoreAvailability(
      this.storeAvailabilityContainer
    );
  }
  if (this.storeAvailability) {
    var e = document.getElementById(pS);
    var value = e.options[e.selectedIndex].value;
    this.storeAvailability.updateContent(
      value,
      this.productSingleObject.title
    );
  }
};
theme.StoreAvailability = (function(container) {
  var selectors = {
    storeAvailabilityModalProductTitle: '[data-store-availability-modal-product-title]'
  };
  function StoreAvailability(container) {
    this.container = container;
    this.sectionId = this.container.getAttribute('data-section-id');
    this.pT = this.container.dataset.productTitle;
  }
  StoreAvailability.prototype = Object.assign({}, StoreAvailability.prototype, {
    updateContent: function(variantId) {
      var variantSectionUrl =
          this.container.dataset.baseUrl +
          '/variants/' +
          variantId +
          '/?section_id=store-availability';
      var self = this;
      fetch(variantSectionUrl)
      .then(function(response) {
        return response.text();
      })
      .then(function(storeAvailabilityHTML) {
        if (storeAvailabilityHTML.trim() === '') {
          return;
        }
        self.container.innerHTML = storeAvailabilityHTML;
        self.container.innerHTML = self.container.firstElementChild.innerHTML;
        var storeAvailabilityModalProductTitle = self.container.querySelector(
          selectors.storeAvailabilityModalProductTitle
        );
        if (storeAvailabilityModalProductTitle) {
          storeAvailabilityModalProductTitle.textContent = self.pT;
        }
        var el = self.container.querySelector('.srfc');        
        const body = document.body;
        const content = self.container.querySelector('.StoreAvailabilityModal');        
        if (!el) return;
        const m = document.querySelector('#avail-' + variantId);
        const mc = content.querySelector('.modal-container');
        const aB = document.getElementById('ajaxBusy');
        el.onclick = (e) => {          
          try {
            MicroModal.show('avail-' + variantId, {
              onShow: function(modal) {
                m.classList.add('loaded');
                mc.classList.add('loaded');
                aB.style.display = 'block';
                document.body.classList.add('modal-active');
              },
              onClose: function(modal) {
                setTimeout(function() {
                  m.classList.remove('loaded');
                  document.body.classList.remove('modal-active');
                }, 250);
                mc.classList.remove('loaded');
                aB.style.display = 'none';
              }
            });
          } catch (e) {
            console.log("micromodal error: ", e);
          }
          e.preventDefault();
        }
      });
    },
  });
  return StoreAvailability;
})();

theme.LibraryLoader = (function() {
  var types = {
    link: 'link',
    script: 'script'
  };
  var status = {
    requested: 'requested',
    loaded: 'loaded'
  };
  var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';
  var libraries = {
    plyrShopifyStyles: {
      tagId: 'plyr-shopify-styles',
      src: cloudCdn + 'plyr/v2.0/shopify-plyr.css',
      type: types.link
    },
    modelViewerUiStyles: {
      tagId: 'shopify-model-viewer-ui-styles',
      src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
      type: types.link
    }
  };
  function load(libraryName, callback) {
    var library = libraries[libraryName];
    if (!library) return;
    if (library.status === status.requested) return;
    callback = callback || function() {};
    if (library.status === status.loaded) {
      callback();
      return;
    }
    library.status = status.requested;
    var tag;
    switch (library.type) {
      case types.script:
        tag = createScriptTag(library, callback);
        break;
      case types.link:
        tag = createLinkTag(library, callback);
        break;
    }
    tag.id = library.tagId;
    library.element = tag;
    var firstScriptTag = document.getElementsByTagName(library.type)[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  function createScriptTag(library, callback) {
    var tag = document.createElement('script');
    tag.src = library.src;
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }
  function createLinkTag(library, callback) {
    var tag = document.createElement('link');
    tag.href = library.src;
    tag.rel = 'stylesheet';
    tag.type = 'text/css';
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }
  return {
    load: load
  };
})();
theme.product_video = (function() {
  var videos = {},
      hosts = {
        shopify: 'shopify',
        external: 'external'
      },
      selectors = {
        productMediaWrapper: '[data-product-single-media-wrapper]'
      },
      attributes = {
        enableVideoLooping: 'enable-video-looping',
        videoId: 'video-id'
      };
  function init(videoContainer, sectionId) {
    if (!videoContainer) {
      return;
    }
    var videoElement = videoContainer.querySelector('iframe, video');
    if (!videoElement) {
      return;
    }
    var mediaId = videoContainer.getAttribute('data-media-id');
    videos[mediaId] = {
      mediaId: mediaId,
      sectionId: sectionId,
      host: hostFromVideoElement(videoElement),
      container: videoContainer,
      element: videoElement,
      ready: function() {
        createPlayer(this);
      }
    };
    window.Shopify.loadFeatures([
      {
        name: 'video-ui',
        version: '2.0',
        onLoad: setupVideos
      }
    ]);
    theme.LibraryLoader.load('plyrShopifyStyles');
  }
  function setupVideos(errors) {
    if (errors) {
      fallbackToNativeVideo();
      return;
    }
    loadVideos();
  }
  function createPlayer(video) {
    if (video.player) {
      return;
    }
    var productMediaWrapper = video.container.closest(selectors.productMediaWrapper),
        enableLooping = productMediaWrapper.getAttribute('data-' + attributes.enableVideoLooping) === 'true';
    // eslint-disable-next-line no-undef
    video.player = new Shopify.Video(video.element, {
      loop: { active: enableLooping }
    });
    var pauseVideo = function() {
      if (!video.player) return;
      video.player.pause();
    };
    productMediaWrapper.addEventListener('mediaHidden', pauseVideo);
    productMediaWrapper.addEventListener('xrLaunch', pauseVideo);
    productMediaWrapper.addEventListener('mediaVisible', function() {
      if (theme.Helpers.isTouch()) return;
      if (!video.player) return;
      video.player.play();
    });
  }
  function hostFromVideoElement(video) {
    if (video.tagName === 'VIDEO') {
      return hosts.shopify;
    }
    return hosts.external;
  }
  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        video.ready();
      }
    }
  }
  function fallbackToNativeVideo() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        if (video.nativeVideo) continue;
        if (video.host === hosts.shopify) {
          video.element.setAttribute('controls', 'controls');
          video.nativeVideo = true;
        }
      }
    }
  }
  function removeSectionVideos(sectionId) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        if (video.sectionId === sectionId) {
          if (video.player) video.player.destroy();
          delete videos[key];
        }
      }
    }
  }
  return {
    init: init,
    hosts: hosts,
    loadVideos: loadVideos,
    removeSectionVideos: removeSectionVideos
  };
})();
function onYouTubeIframeAPIReady() {
  theme.product_video.loadVideos(theme.product_video.hosts.external);
}
theme.product_model = (function() {
  var modelJsonSections = {},
      models = {},
      xrButtons = {},
      selectors = {
    mediaGroup: '[data-product-single-media-group]',
    xrButton: '[data-shopify-xr]'
  };
  function init(modelViewerContainers, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false
    };
    modelViewerContainers.forEach(function(modelViewerContainer, index) {
      var mediaId = modelViewerContainer.getAttribute('data-media-id'),
          modelViewerElement = modelViewerContainer.querySelector(
        'model-viewer'
      );
      var modelId = modelViewerElement.getAttribute('data-model-id');
      if (index === 0) {
        var mediaGroup = modelViewerContainer.closest(selectors.mediaGroup),
            xrButton = mediaGroup.querySelector(selectors.xrButton);
        xrButtons[sectionId] = {
          element: xrButton,
          defaultId: modelId
        };
      }
      models[mediaId] = {
        modelId: modelId,
        sectionId: sectionId,
        container: modelViewerContainer,
        element: modelViewerElement
      };
    });
    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi
      }
    ]);
    theme.LibraryLoader.load('modelViewerUiStyles');
  }
  function setupShopifyXr(errors) {
    if (errors) return;
    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function() {
        setupShopifyXr();
      });
      return;
    }
    for (var sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        var modelSection = modelJsonSections[sectionId];
        if (modelSection.loaded) continue;
        var modelJson = document.querySelector('#ModelJson-' + sectionId);
        window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
        modelSection.loaded = true;
      }
    }
    window.ShopifyXR.setupXRElements();
  }
  function setupModelViewerUi(errors) {
    if (errors) return;
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.element);
        }
        setupModelViewerListeners(model);
      }
    }
  }
  function setupModelViewerListeners(model) {
    var xrButton = xrButtons[model.sectionId];
    model.container.addEventListener('mediaVisible', function() {
      xrButton.element.setAttribute('data-shopify-model3d-id', model.modelId);
      if (theme.Helpers.isTouch()) return;
      model.modelViewerUi.play();
    });
    model.container.addEventListener('mediaHidden', function() {
      xrButton.element.setAttribute(
        'data-shopify-model3d-id',
        xrButton.defaultId
      );
      model.modelViewerUi.pause();
    });
    model.container.addEventListener('xrLaunch', function() {
      model.modelViewerUi.pause();
    });
  }
  function removeSectionModels(sectionId) {
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (model.sectionId === sectionId) {
          models[key].modelViewerUi.destroy();
          delete models[key];
        }
      }
    }
    delete modelJsonSections[sectionId];
  }
  return {
    init: init,
    removeSectionModels: removeSectionModels
  };
})();
theme.product_media = function (container) {  
  var sectionId = container.getAttribute('data-section-id'),
      productMediaWrapper = container.querySelectorAll('[data-product-single-media-wrapper]'),
      productMediaTypeModel = container.querySelectorAll('[data-product-media-type-model]'),
      productMediaTypeVideo = container.querySelectorAll('[data-product-media-type-video]');
  productMediaTypeVideo.forEach(function(p) {
    theme.product_video.init(p, sectionId);
  });
  if (productMediaTypeModel.length < 1) return;
  theme.product_model.init(productMediaTypeModel, sectionId);
  document.addEventListener('shopify_xr_launch', function() {
    var currentMedia = container.querySelector(productMediaWrapper + ':not(.hidden)');
    currentMedia.dispatchEvent(new CustomEvent('xrLaunch'));
  });
};

function ProductOptions(container){
  var sectionId = container.getAttribute('data-section-id'),
      productId = container.getAttribute('data-product-id');
  const m = document.querySelector('#quick-modal');
  const mc = m.querySelector('.modal-container'); 
  const mcC = mc.querySelector('.modal-content'); 
  const aB = document.getElementById('ajaxBusy');
  var pS = document.getElementById('product-select-' + sectionId);
  var c = container.getAttribute('data-cart');  
  if (pS) {
    ProductOptionSelection();
    ProductOptionsJS(container);  
    ProductSelectCallback(container);  
    Swatches(container);    
  };
  theme.product_media(container);
  Quantity(container);  
  if(c == 'true'){
    Cart(container);
  }
  var el = document.querySelectorAll('.tooltip');
  el.forEach(function(e) {
    e.onclick = function(ev){      
      const content = this.getAttribute('data-container');
      const content_container = this.parentNode;
      e.focus();
      aB.style.display = 'block';
      const section = JSON.parse(content_container.querySelector('.' + content).innerText);
      MicroModal.show('quick-modal', {
        onShow: function(modal) {
          m.classList.add('loaded');
          mc.classList.add('loaded');
          document.body.classList.add('modal-active');
        },
        onClose: function(modal) {              
          setTimeout(function() {
            m.classList.remove('loaded');
            document.body.classList.remove('modal-active');            
            mcC.innerHTML = '';            
          }, 250);
          mc.classList.remove('loaded');
          aB.style.display = 'none';
        }
      });    
      m.classList.add('loaded');
      mcC.innerHTML = section;
    };
  });
}
function Zoom(){
  // Drift 1.4.1 | https://github.com/imgix/drift | Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
  var u="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this;function v(){v=function(){},u.Symbol||(u.Symbol=A)}var B=0;function A(t){return"jscomp_symbol_"+(t||"")+B++}!function(t){function i(n){if(e[n])return e[n].T;var s=e[n]={ja:n,fa:!1,T:{}};return t[n].call(s.T,s,s.T,i),s.fa=!0,s.T}var e={};i.u=t,i.h=e,i.c=function(t,e,n){i.g(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){v(),v(),"undefined"!=typeof Symbol&&Symbol.toStringTag&&(v(),Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})),Object.defineProperty(t,"__esModule",{value:!0})},i.m=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.ba)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.c(n,s,function(i){return t[i]}.bind(null,s));return n},i.i=function(t){var e=t&&t.ba?function(){return t.default}:function(){return t};return i.c(e,"a",e),e},i.g=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},i.o="",i(i.v=0)}([function(t,i,e){function n(t,i){if(i=void 0===i?{}:i,this.h=t,this.g=this.g.bind(this),!a(this.h))throw new TypeError("`new Drift` requires a DOM element as its first argument.");t=i.namespace||null;var e=i.showWhitespaceAtEdges||!1,n=i.containInline||!1,s=i.inlineOffsetX||0,o=i.inlineOffsetY||0,h=i.inlineContainer||document.body,r=i.sourceAttribute||"data-zoom",d=i.zoomFactor||3,u=void 0===i.paneContainer?document.body:i.paneContainer,c=i.inlinePane||375,f=!("handleTouch"in i)||!!i.handleTouch,p=i.onShow||null,l=i.onHide||null,b=!("injectBaseStyles"in i)||!!i.injectBaseStyles,v=i.hoverDelay||0,m=i.touchDelay||0,y=i.hoverBoundingBox||!1,g=i.touchBoundingBox||!1;if(i=i.boundingBoxContainer||document.body,!0!==c&&!a(u))throw new TypeError("`paneContainer` must be a DOM element when `inlinePane !== true`");if(!a(h))throw new TypeError("`inlineContainer` must be a DOM element");this.a={j:t,P:e,I:n,K:s,L:o,w:h,R:r,f:d,ga:u,ea:c,C:f,O:p,N:l,da:b,F:v,A:m,D:y,G:g,H:i},this.a.da&&!document.querySelector(".drift-base-styles")&&((i=document.createElement("style")).type="text/css",i.classList.add("drift-base-styles"),i.appendChild(document.createTextNode(".drift-bounding-box,.drift-zoom-pane{position:absolute;pointer-events:none}@keyframes noop{0%{zoom:1}}@-webkit-keyframes noop{0%{zoom:1}}.drift-zoom-pane.drift-open{display:block}.drift-zoom-pane.drift-closing,.drift-zoom-pane.drift-opening{animation:noop 1ms;-webkit-animation:noop 1ms}.drift-zoom-pane{overflow:hidden;width:100%;height:100%;top:0;left:0}.drift-zoom-pane-loader{display:none}.drift-zoom-pane img{position:absolute;display:block;max-width:none;max-height:none}")),(t=document.head).insertBefore(i,t.firstChild)),this.v(),this.u()}function s(t){t=void 0===t?{}:t,this.h=this.h.bind(this),this.g=this.g.bind(this),this.m=this.m.bind(this),this.s=!1;var i=void 0===t.J?null:t.J,e=void 0===t.f?c():t.f,n=void 0===t.U?c():t.U,s=void 0===t.j?null:t.j,o=void 0===t.P?c():t.P,h=void 0===t.I?c():t.I;this.a={J:i,f:e,U:n,j:s,P:o,I:h,K:void 0===t.K?0:t.K,L:void 0===t.L?0:t.L,w:void 0===t.w?document.body:t.w},this.o=this.i("open"),this.Y=this.i("opening"),this.u=this.i("closing"),this.v=this.i("inline"),this.V=this.i("loading"),this.ha()}function o(t){t=void 0===t?{}:t,this.m=this.m.bind(this),this.B=this.B.bind(this),this.g=this.g.bind(this),this.c=this.c.bind(this);var i=t;t=void 0===i.b?c():i.b;var e=void 0===i.l?c():i.l,n=void 0===i.R?c():i.R,s=void 0===i.C?c():i.C,o=void 0===i.O?null:i.O,a=void 0===i.N?null:i.N,r=void 0===i.F?0:i.F,d=void 0===i.A?0:i.A,u=void 0===i.D?c():i.D,f=void 0===i.G?c():i.G,p=void 0===i.j?null:i.j,l=void 0===i.f?c():i.f;i=void 0===i.H?c():i.H,this.a={b:t,l:e,R:n,C:s,O:o,N:a,F:r,A:d,D:u,G:f,j:p,f:l,H:i},(this.a.D||this.a.G)&&(this.o=new h({j:this.a.j,f:this.a.f,S:this.a.H})),this.enabled=!0,this.M()}function h(t){this.s=!1;var i=void 0===t.j?null:t.j,e=void 0===t.f?c():t.f;t=void 0===t.S?c():t.S,this.a={j:i,f:e,S:t},this.c=this.g("open"),this.h()}function a(t){return f?t instanceof HTMLElement:t&&"object"==typeof t&&null!==t&&1===t.nodeType&&"string"==typeof t.nodeName}function r(t,i){i.forEach((function(i){t.classList.add(i)}))}function d(t,i){i.forEach((function(i){t.classList.remove(i)}))}function c(){throw Error("Missing parameter")}e.r(i);var f="object"==typeof HTMLElement;h.prototype.g=function(t){var i=["drift-"+t],e=this.a.j;return e&&i.push(e+"-"+t),i},h.prototype.h=function(){this.b=document.createElement("div"),r(this.b,this.g("bounding-box"))},h.prototype.show=function(t,i){this.s=!0,this.a.S.appendChild(this.b);var e=this.b.style;e.width=Math.round(t/this.a.f)+"px",e.height=Math.round(i/this.a.f)+"px",r(this.b,this.c)},h.prototype.W=function(){this.s&&this.a.S.removeChild(this.b),this.s=!1,d(this.b,this.c)},h.prototype.setPosition=function(t,i,e){var n=window.pageXOffset,s=window.pageYOffset;t=e.left+t*e.width-this.b.clientWidth/2+n,i=e.top+i*e.height-this.b.clientHeight/2+s,t<e.left+n?t=e.left+n:t+this.b.clientWidth>e.left+e.width+n&&(t=e.left+e.width-this.b.clientWidth+n),i<e.top+s?i=e.top+s:i+this.b.clientHeight>e.top+e.height+s&&(i=e.top+e.height-this.b.clientHeight+s),this.b.style.left=t+"px",this.b.style.top=i+"px"},o.prototype.i=function(t){t.preventDefault()},o.prototype.u=function(t){this.a.A&&this.V(t)&&!this.s||t.preventDefault()},o.prototype.V=function(t){return!!t.touches},o.prototype.M=function(){this.a.b.addEventListener("mouseenter",this.g,!1),this.a.b.addEventListener("mouseleave",this.B,!1),this.a.b.addEventListener("mousemove",this.c,!1),this.a.C?(this.a.b.addEventListener("touchstart",this.g,!1),this.a.b.addEventListener("touchend",this.B,!1),this.a.b.addEventListener("touchmove",this.c,!1)):(this.a.b.addEventListener("touchstart",this.i,!1),this.a.b.addEventListener("touchend",this.i,!1),this.a.b.addEventListener("touchmove",this.i,!1))},o.prototype.ca=function(){this.a.b.removeEventListener("mouseenter",this.g,!1),this.a.b.removeEventListener("mouseleave",this.B,!1),this.a.b.removeEventListener("mousemove",this.c,!1),this.a.C?(this.a.b.removeEventListener("touchstart",this.g,!1),this.a.b.removeEventListener("touchend",this.B,!1),this.a.b.removeEventListener("touchmove",this.c,!1)):(this.a.b.removeEventListener("touchstart",this.i,!1),this.a.b.removeEventListener("touchend",this.i,!1),this.a.b.removeEventListener("touchmove",this.i,!1))},o.prototype.g=function(t){this.u(t),this.h=t,"mouseenter"==t.type&&this.a.F?this.v=setTimeout(this.m,this.a.F):this.a.A?this.v=setTimeout(this.m,this.a.A):this.m()},o.prototype.m=function(){if(this.enabled){var t=this.a.O;t&&"function"==typeof t&&t(),this.a.l.show(this.a.b.getAttribute(this.a.R),this.a.b.clientWidth,this.a.b.clientHeight),this.h&&((t=this.h.touches)&&this.a.G||!t&&this.a.D)&&this.o.show(this.a.l.b.clientWidth,this.a.l.b.clientHeight),this.c()}},o.prototype.B=function(t){t&&this.u(t),this.h=null,this.v&&clearTimeout(this.v),this.o&&this.o.W(),(t=this.a.N)&&"function"==typeof t&&t(),this.a.l.W()},o.prototype.c=function(t){if(t)this.u(t),this.h=t;else{if(!this.h)return;t=this.h}if(t.touches)var i=(t=t.touches[0]).clientX,e=t.clientY;else i=t.clientX,e=t.clientY;i=(i-(t=this.a.b.getBoundingClientRect()).left)/this.a.b.clientWidth,e=(e-t.top)/this.a.b.clientHeight,this.o&&this.o.setPosition(i,e,t),this.a.l.setPosition(i,e,t)},u.Object.defineProperties(o.prototype,{s:{configurable:!0,enumerable:!0,get:function(){return this.a.l.s}}}),t=document.createElement("div").style;var p="undefined"!=typeof document&&("animation"in t||"webkitAnimation"in t);s.prototype.i=function(t){var i=["drift-"+t],e=this.a.j;return e&&i.push(e+"-"+t),i},s.prototype.ha=function(){this.b=document.createElement("div"),r(this.b,this.i("zoom-pane"));var t=document.createElement("div");r(t,this.i("zoom-pane-loader")),this.b.appendChild(t),this.c=document.createElement("img"),this.b.appendChild(this.c)},s.prototype.X=function(t){this.c.setAttribute("src",t)},s.prototype.Z=function(t,i){this.c.style.width=t*this.a.f+"px",this.c.style.height=i*this.a.f+"px"},s.prototype.setPosition=function(t,i,e){var n=this.c.offsetWidth,s=this.c.offsetHeight,o=this.b.offsetWidth,h=this.b.offsetHeight,a=o/2-n*t,r=h/2-s*i,d=o-n,u=h-s,c=0<d,f=0<u;s=c?d/2:0,n=f?u/2:0,d=c?d/2:d,u=f?u/2:u,this.b.parentElement===this.a.w&&(f=window.pageXOffset,c=window.pageYOffset,t=e.left+t*e.width-o/2+this.a.K+f,i=e.top+i*e.height-h/2+this.a.L+c,this.a.I&&(t<e.left+f?t=e.left+f:t+o>e.left+e.width+f&&(t=e.left+e.width-o+f),i<e.top+c?i=e.top+c:i+h>e.top+e.height+c&&(i=e.top+e.height-h+c)),this.b.style.left=t+"px",this.b.style.top=i+"px"),this.a.P||(a>s?a=s:a<d&&(a=d),r>n?r=n:r<u&&(r=u)),this.c.style.transform="translate("+a+"px, "+r+"px)",this.c.style.webkitTransform="translate("+a+"px, "+r+"px)"},s.prototype.M=function(){this.b.removeEventListener("animationend",this.h,!1),this.b.removeEventListener("animationend",this.g,!1),this.b.removeEventListener("webkitAnimationEnd",this.h,!1),this.b.removeEventListener("webkitAnimationEnd",this.g,!1),d(this.b,this.o),d(this.b,this.u)},s.prototype.show=function(t,i,e){this.M(),this.s=!0,r(this.b,this.o),this.c.getAttribute("src")!=t&&(r(this.b,this.V),this.c.addEventListener("load",this.m,!1),this.X(t)),this.Z(i,e),this.ia?this.aa():this.$(),p&&(this.b.addEventListener("animationend",this.h,!1),this.b.addEventListener("webkitAnimationEnd",this.h,!1),r(this.b,this.Y))},s.prototype.aa=function(){this.a.w.appendChild(this.b),r(this.b,this.v)},s.prototype.$=function(){this.a.J.appendChild(this.b)},s.prototype.W=function(){this.M(),this.s=!1,p?(this.b.addEventListener("animationend",this.g,!1),this.b.addEventListener("webkitAnimationEnd",this.g,!1),r(this.b,this.u)):(d(this.b,this.o),d(this.b,this.v))},s.prototype.h=function(){this.b.removeEventListener("animationend",this.h,!1),this.b.removeEventListener("webkitAnimationEnd",this.h,!1),d(this.b,this.Y)},s.prototype.g=function(){this.b.removeEventListener("animationend",this.g,!1),this.b.removeEventListener("webkitAnimationEnd",this.g,!1),d(this.b,this.o),d(this.b,this.u),d(this.b,this.v),this.b.setAttribute("style",""),this.b.parentElement===this.a.J?this.a.J.removeChild(this.b):this.b.parentElement===this.a.w&&this.a.w.removeChild(this.b)},s.prototype.m=function(){this.c.removeEventListener("load",this.m,!1),d(this.b,this.V)},u.Object.defineProperties(s.prototype,{ia:{configurable:!0,enumerable:!0,get:function(){var t=this.a.U;return!0===t||"number"==typeof t&&window.innerWidth<=t}}}),n.prototype.v=function(){this.l=new s({J:this.a.ga,f:this.a.f,P:this.a.P,I:this.a.I,U:this.a.ea,j:this.a.j,K:this.a.K,L:this.a.L,w:this.a.w})},n.prototype.u=function(){this.c=new o({b:this.h,l:this.l,C:this.a.C,O:this.a.O,N:this.a.N,R:this.a.R,F:this.a.F,A:this.a.A,D:this.a.D,G:this.a.G,j:this.a.j,f:this.a.f,H:this.a.H})},n.prototype.M=function(t){this.l.X(t)},n.prototype.i=function(){this.c.enabled=!1},n.prototype.m=function(){this.c.enabled=!0},n.prototype.g=function(){this.c.B(),this.c.ca()},u.Object.defineProperties(n.prototype,{s:{configurable:!0,enumerable:!0,get:function(){return this.l.s}},f:{configurable:!0,enumerable:!0,get:function(){return this.a.f},set:function(t){this.a.f=t,this.l.a.f=t,this.c.a.f=t,this.o.a.f=t}}}),Object.defineProperty(n.prototype,"isShowing",{get:function(){return this.s}}),Object.defineProperty(n.prototype,"zoomFactor",{get:function(){return this.f},set:function(t){this.f=t}}),n.prototype.setZoomImageURL=n.prototype.M,n.prototype.disable=n.prototype.i,n.prototype.enable=n.prototype.m,n.prototype.destroy=n.prototype.g,window.Drift=n}]);
}
Zoom();
function Product(container) {
  var sectionId = container.getAttribute('data-section-id');
  let sectionType = container.dataset.sectionType;
  if (sectionType === 'product-alt') {
    ProductOptions(container);
  }
  var pg = container.querySelector('.product-gift-' + sectionId);
  if (pg) {
    var i = pg.querySelector('input[type="checkbox"]'),
        d = pg.querySelector('details');
    i.onchange = function(ev){
      d.toggleAttribute('open')
    }
  }
  var ti = container.querySelectorAll('.thumb-image-' + sectionId);
  ti.forEach(function(t) {
    t.addEventListener('click', function(ev) {
      var img = t.querySelector('img'),          
          id = t.getAttribute('data-image-id'),        
          a = t.querySelector('button.img-align'),
          vi = '.variant-image-' + sectionId,
          ot = container.querySelectorAll(vi),
          nt = document.getElementById('variant-image-' + id),
          pi = document.getElementById('product-id-' + sectionId);
      Array.prototype.filter.call(t.parentNode.children, function(c){
        c.querySelector('button').setAttribute('aria-current', false);
      });
      a.setAttribute('aria-current', true);
      var cm = document.querySelector(vi + '.visible');
      cm.dispatchEvent(new CustomEvent('mediaHidden'));
      nt.dispatchEvent(new CustomEvent('mediaVisible'));
      ot.forEach(function(o) {
        o.classList.add('hidden')
        o.classList.remove('visible')
        o.blur()
      });
      nt.classList.add('visible');
      nt.classList.remove('hidden');
      var el = pi.querySelectorAll('.selector-wrapper');
      el.forEach(function(e) {
        e.classList.add('active');
      });
    }, false);
  });  
  var Carousel = document.getElementById('thumbnails-'+ sectionId);  
  if (Carousel) {
    var next = document.getElementById('glider-button-next-thumbs-' + sectionId),
        prev = document.getElementById('glider-button-prev-thumbs-' + sectionId),
        glider = new Glider(Carousel, {
          arrows: {
            prev: prev,
            next: next
          },
          draggable: true,
          dragVelocity:2.5,
          resizeLock: false,
          skipTrack: true, 
          slidesToShow: 4,
          slidesToScroll: 4
        });
    if (glider) {
      Carousel.classList.add('loaded');
    }
  };
}

document.addEventListener('Section:Loaded', function(event){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  if(sectionType === 'product-alt' || sectionType === 'product_page'){
    Product(sectionContainer);
  }
})

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'product_page' || sectionType === 'product-alt' && !sectionContainer.classList.contains('ignore')){
    Product(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})

theme.Product = (function() {
  function Product(container) {
    var sectionId = container.getAttribute('data-section-id'),
        type = container.getAttribute('data-carousel-type');
    ProductOptions(container);
    if (type == 'section') {
      Tabs(container);
      if (Shopify.designMode) {        
        var Carousel = document.getElementById('tabs-carousel-' + sectionId);
        Product.prototype.onBlockSelect = function(ev) {
          var tI = container.querySelectorAll('.tabs-id-' + sectionId + ' a'),
              tB = container.querySelectorAll('.tab-body-id-' + sectionId),
              tT = ev.target,
              tH = container.querySelector(ev.target.getAttribute('href'));
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
          var tC = document.getElementById('tabs-carousel-' + sectionId);
          if (tC) {        
            var mSI = parseInt(ev.target.getAttribute('data-gslide'));
            Glider(tC).scrollItem(parseInt(mSI));
          }
        };
      }
    }    
    if (Shopify.designMode && window.SPR) {
      SPR.initDomEls();
      SPR.loadBadges();
    }
  }
  return Product;
})();