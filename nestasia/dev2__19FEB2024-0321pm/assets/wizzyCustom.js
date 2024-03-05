window.onWizzyScriptLoaded = function () {
  $('#wizzy-shopify-collection-page-wrapper').html('')
  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_INIT, function (payload) {
    console.log("wizzy loaded")
    // $(".loaderSMSMSMS").css("display", "none");

    window.wizzyConfig.common.lazyDOMConfig.searchInputIdentifiers.push({ 'dom': '.search-field', 'type': 'text' });
    window.wizzyConfig.search.configs.general.searchEndpoint = '/pages/search-results-page'
    wizzyConfig.search.configs.facets.leftFacets.mobileCollapsible = true;
    allCollectionRedirect()
    if (!window.wizzyConfig.common.isOnCategoryPage) {
      window.wizzyConfig.common.lazyDOMConfig.contentDOMIdentifiers.push('#content');
    }

    if (window.wizzyConfig.common.isOnCategoryPage) {
      window.wizzyConfig['search']['configs']['pagination']['infiniteScrollOffset'] = { desktop: $('.toppad').height() + $('#shopify-section-footer').height() + 1000, mobile: $('.toppad').height() + $('#shopify-section-footer').height() + 2000 };
    }

    if (screen.width < 768) {
      window.wizzyConfig.search.configs.facets.leftFacets.defaultCollapsed = true;
    }
    // window.sessionStorage.set("wizzyProductsArray")
    // window.sessionStorage.getItem("wizzyProductsArray")
    window.wizzyProductsArray = window.sessionStorage.getItem("wizzyProductsArray") ? JSON.parse(window.sessionStorage.getItem("wizzyProductsArray")) : []
    // setTimeout(function () {
    //   $('.facet-search-wrapper').addClass('active');
    // }, 5000);
    return payload;

  })

  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_SEARCH_EXECUTED, function (payload) {
    payload.attributeFacetValuesLimit = 50;
    // window.Moengage.track_event("Product_Search", {
    //   "search_term": payload.q,
    // });
    return payload
  })

  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_FILTERS_EXECUTED, function (payload) {
    payload.filters.attributeFacetValuesLimit = 50;
    return payload
  })


  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_RENDER_RESULTS, function (payload) {
    if (payload.api === 'filter') {
      if (payload.response.payload.filters.page === 1) {
        window.sessionStorage.removeItem("wizzyProductsArray");
        window.wizzyProductsArray = []
      }
    }

    if (payload.api === 'search') {
      if (payload.response.payload.filters.page === 1) {
        window.sessionStorage.removeItem("wizzyProductsArray");
        window.wizzyProductsArray = []
      }
    }
    if (payload.api === 'search' || payload.api === "filter") {
      var facets = payload.response.payload.facets;

      facets.forEach((facet) => {
        if (facet.key === "discountPercentage") {
          let maxDiscount = 0;

          facet.data.forEach((facetitem) => {

            if (facetitem.key > maxDiscount) {
              maxDiscount = facetitem.key;
            }

          })

          let discountArray = [10, 15, 30, 40, 50, 60];
          facetItem = []
          discountArray.forEach((discount) => {
            if (discount <= maxDiscount) {
              facetItem.push({
                data: {
                  start: discount,
                  label: discount
                },
                key: discount,
                label: `${discount}%`
              })
            }
          })



          facet.data = facetItem;

        }
      })

    }
    return payload;
  })


  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.VIEW_RENDERED, function (payload) {
    // console.log("payload",payload.data.response.payload.total);
    $("#product_countTotal").text(payload.data.response.payload.total);


    if (!$('.wizzy-selected-filters').text().trim()) {

      // $('.wizzy-search-filters-top').css('position', 'absolute')
    }
    else {

      $('.wizzy-search-filters-top').css('position', 'static')
    }


    if (payload.data.api === 'autocomplete') {
      renderStarsAutoComplete();

      if (screen.width > 768) {
        if ($('#shopify-section-header').offset().top > 42) {
          $('.wizzy-autocomplete-wrapper').addClass('strip-invisible')
        }
        else {
          $('.wizzy-autocomplete-wrapper').removeClass('strip-invisible')
        }
      }
      else {
        if ($('#shopify-section-header').offset().top > 42) {
          $('.wizzy-autocomplete-wrapper').addClass('strip-invisible')
        }
        else {
          $('.wizzy-autocomplete-wrapper').removeClass('strip-invisible')
        }
      }

    }
    return payload;
  })

  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.PRODUCTS_RESULTS_RENDERED, function (payload) {
    console.log('payload',payload)
    if ($(".wizzy-result-product").length === 1) {
      $("body .wizzy-search-wrapper.has-left-facets .wizzy-search-results-wrapper .wizzy-search-results-container .wizzy-search-filters-top").css("position", "static")
    }
    if (window.location.href.split("/").includes('pages')) {

      $('.breadcrumb_text').css('display', 'none');
      $('.container.grid.clearfix').css('display', 'none');
    }
    setTimeout(function () { $('.wizzy-autocomplete-wrapper').css('display', 'none') }, 500)
    // addToCart();  
    mobileSearchBack();
    searchPopupClose();
    removeClassFromMain();
    renderStars();

    dropdownCheck();

    if(userlogincheck == false) wishlistAttach()

    return payload
  });

  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.PRODUCTS_RESULTS_RENDERED, function (payload) {
    //  Observer for Sort ****************************************************************************************************************************
    var observer1 = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutationRecord) {
        if ($('.wizzy-common-select-options').css('display') === 'block') {
          // alert("Inside Test")
          $('#wa-chat-btn-root').css('display', 'none');
          $('#back-to-top').css('z-index', '-1')
        }
        else {
          $('#wa-chat-btn-root').css('display', 'block')
          $('#back-to-top').css('z-index', '99999')
        }

      });
    });

    var target1 = document.getElementsByClassName('wizzy-common-select-options')[0];
    observer1.observe(target1, { attributes: true, attributeFilter: ['style'] });

    // **********************************************************************************************************************************************

    window.wizzyProductsArray = [...window.wizzyProductsArray, ...window.wizzyConfig.pageStore.searchedResponse.result];
    try {
      window.sessionStorage.setItem("wizzyProductsArray", JSON.stringify(window.wizzyProductsArray))
      //$(".loaderSMSMSMS").css("display","none");

    } catch (e) {
      console.log("loaderSMSMSMS display catch", e)
      //$(".loaderSMSMSMS").css("display","none");
    }
    quickView();
    // $(".loaderSMSMSMS").css("display", "none");
  })


  window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.AFTER_PRODUCTS_TRANSFORMED, function (payload) {

    try {
      payload.forEach((item) => {
        // console.log("item",item);


        if (item.price) {
          price = parseInt(item.price.replace(/,/g, ''), 10)
          item.price = price.toLocaleString()
        }
        if (item.sellingPrice) {
          sellingPrice = parseInt(item.sellingPrice.replace(/,/g, ''), 10)
          item.sellingPrice = sellingPrice.toLocaleString()
        }


        let foundVariant = item.attributes.filter(varin => varin.id == 'product_variant_ids');

        item.varientGroupId = item.groupId ? item.groupId : foundVariant[0].values[0].variationId;


        item.attributes.forEach((attr) => {

          if (attr.id === 'product_rating_Reviews') {

            item.star = JSON.parse(attr.values[0].value[0]).value;
            [item.noOfFullStars, item.noOfHalfStars, item.noOfEmptyStars] = numberofStars(item.star);
            item.starMarkup = starMarkUp(item.noOfFullStars, item.noOfHalfStars, item.noOfEmptyStars)

          }

          if (attr.id === 'product_rating_count_Reviews') {
            item.reviewCount = attr.values[0].value[0]
          }
          if (attr.id === "product_variant_ids") {
            item.id = attr.values[0].value[0];


          }
          if (attr.id === "product_tags") {
            item.isOfferAvailable = isOfferAvailable(attr.values[0].value[0].split(","))
          }

          if (attr.id === 'product__collection_top_badge_custom') {
            item.collBadgeTop = attr.values[0].value[0]
          }

          if (attr.id === 'product__collection_bottom_badge_custom') {
            item.collBadgeBottom = attr.values[0].value[0]
          }

        })
        if (window.location.href.split("/").includes("collections") && !window.location.href.split("/").includes("products")) {
          let p_url = item.url.split('/products');
          if (p_url.length >= 2) {
            item.url = window.location.host + '/products' + p_url[1]
          }
        }

        item.swatchGeneratorObject = item.hasSwatches ? JSON.stringify(item.swatches[0].values.map((val) => ({
          value: val.value,
          variationId: val.variationId
        }))) : false
      })

    } catch (error) {
      console.log(error)
    }


    // console.log(payload);
    return payload;
  });



  $(document).ready(function () {
    mobileSearch();
    replaceTemplate("wizzy-search-results-product");
    replaceTemplate("wizzy-autocomplete-topproducts");
    replaceTemplate("wizzy-progress");
    replaceTemplate('wizzy-search-summary');
    replaceTemplate("wizzy-selected-facets-block");
    replaceTemplate("wizzy-facet-block")

    QuickViewSwatchButtonListender();
    // OnFocusOutEvent();
    addToCart();
    // onScroll();
    addQuantity();
    removeQuantity();
    quickView();

  });


  function addToCart() {
    
    $('body').on('click', '.wizzy-tocart-button', function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();
      let id = $(this).attr('value');

      var sel_pro_name = $(this).closest('.result-product-item-info').find('.product-item-title').text().trim();
      var sel_pro_price = $(this).closest('.result-product-item-info').find('.wizzy-pro-price').text().trim();
      var sel_pro_qty = 1;
      sel_pro_price = sel_pro_price.replace('₹', '');

      console.log(`
      id - ${id}
      sel_pro_name - ${sel_pro_name}
      sel_pro_price - ${sel_pro_price}
      `)

      gtag("event", "add_to_cart", {
        currency: "INR",
        value: Shopify.formatMoney(sel_pro_price, theme.moneyFormat),
        items: [
          {
            item_name: sel_pro_name,
            price: Shopify.formatMoney(sel_pro_price, theme.moneyFormat),
            quantity: sel_pro_qty
          }
        ]
      });

      callAJAXApi(id, 1);

    })
  }

  function OnFocusOutEvent() {
    $(document).on('focusout', '.search-field.wizzy-search-input', function () {

      $('.wizzy-autocomplete-wrapper').css('display', 'none')
    })


  }


  const mobileSearch = () => {
    $("body").on("click", ".search .open.open-header", function () {
      if (!$("body").hasClass("wizzyMobileTapped")) {
        $("#wizzy-search-input").click();
      }
    })
    // const search = document.getElementsByClassName(".search-field.wizzy-search-input")[0];

    // $(".search-field.wizzy-search-input").on('click',()=>{

    //   if(screen.width<768){

    //    document.getElementsByClassName("wizzy-search-form-wrapper")[0].classList.add("mobileTapped");

    //   }


    // })
  }



  function callAJAXApi(id, quantity) {
    // $.ajax({
    //   type: 'POST',
    //   url: 'https://nestasia.in/cart/add.js',
    //   data: { quantity: quantity, id: id },
    //   success: function (response) {
    //     $('.wizzy-quick-view-close-button').click();
    //     window.theme.ajaxLoadCartDrawer('addTocart')
    //     theme.openCart()
    //   },
    //   error: function (xhr, ajaxOptions, thrownError) {
    //     console.log(xhr.responseText);
    //     // conso
    //     if (JSON.parse(xhr.responseText).description) {
    //       alert(JSON.parse(xhr.responseText).description)
    //     }
    //     else {
    //       alert("Error, While Adding Product to Cart! ")
    //     }

    //   }
    // });
    const addbody = {
      items: [
        {
          id: id,
          quantity: quantity,
          properties:{
            "_id":"",
            "giftWrap":"",
            "_giftWrap":""
         }
        }
      ]  
    }
    liquidAjaxCart.add(addbody, options);
    return false;

  }

  function mobileSearchBack() {


    if (screen.width < 768) {


      setTimeout(function () {

        $('.wizzy-search-back .wizzy-icon').click();
        $('.wizzy-autocomplete-wrapper').css('display', 'none')
        $('.wizzy-search-form-wrapper').removeClass('mobileTapped')
      }, 500)



    }
  }

  const searchPopupClose = () => {
    $('.open-header.active').click();
  }

  const replaceTemplate = (div) => {
    let newDiv = document.getElementById(div + "-new").text;
    let oldDiv = document.getElementById(div)
    oldDiv.text = newDiv;
  }

  function onScroll() {
    $(window).on('scroll', function (e) {
      // console.log($('#shopify-section-header').offset().top)
      if (screen.width > 768) {
        if ($('#shopify-section-header').offset().top > 42) {
          $('.wizzy-autocomplete-wrapper').addClass('strip-invisible')
        }
        else {
          $('.wizzy-autocomplete-wrapper').removeClass('strip-invisible')
        }
      }
      else {
        if ($('#shopify-section-header').offset().top > 42) {
          $('.wizzy-autocomplete-wrapper').addClass('strip-invisible')
        }
        else {
          $('.wizzy-autocomplete-wrapper').removeClass('strip-invisible')
        }
      }
    })
  }

  function removeClassFromMain() {
    if (screen.width < 768) {
      $('#content').removeClass('index-page')
    }
  }


  function quickView() {
    $('body').on('click', '.quickview', function (evt) {
      resetCartQuantity();
      removeAttchedEventQuantity();
      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();
      let variationId = $(this).attr('value');

      let groupId = $(this).attr('data-group-id');
      let productdata = window.wizzyProductsArray.filter((item) => item.id === parseInt(variationId))
      console.log(productdata[0].swatches[0].values)
      let buttons = swatchButtonGenerator(productdata[0].swatches[0].values, groupId, variationId);
      $('.wizzy-quick-view-varient-container').html(buttons);
      QuickViewSwatchButtonListender()
      otherImageClickListners()
      addToCartQuickViewID(productdata[0].id)
      quickViewtitleSet(productdata[0].name)
      getVarientData(productdata[0].groupId, productdata[0].id);
      $('.wizzy-quick-view-overlay').css('display', "block")
      $('.wizzy-quick-view-modal').css('display', "flex")
      setBuyNowURL(productdata[0].id)
      quickViewPriceSet(productdata[0].price, productdata[0].sellingPrice)
      if (productdata[0].star && productdata[0].reviewCount) {
        setQuickViewRating(productdata.reviewCount, productdata[0].star)
      }
    })


    $('.wizzy-quick-view-close-button').on('click', function () {
      resetCartQuantity();
      $('.wizzy-quick-view-modal').css('display', "none")
      $('.wizzy-quick-view-overlay').css('display', "none")
    })
  }


  function getVarientData(groupId, variationId) {
    $.ajax({
      url: "https://api.wizzy.ai/v1/products/variation",
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        "x-store-id": "50f5428c8b6611edbd7b0a0c8095feae",
        "x-api-key": "a2ZwajU1dEFPc3EwK3FsbC9zZDRFamtONGtSSlB6SlU5YU5JSUIrMTZ6YStrQU4vUmEzODF0cndnbER4RGNxb2JieVFQVGpBV21Qb1BIYjVoTnFoa2c9PQ=="
      },
      data: JSON.stringify({
        'variationId': variationId,
        'groupId': groupId
      }),
      success: function (res) {

        setImages(res.payload.result.mainImage, res.payload.result.images);
      },
      error: function (error) {

      }
    });
  }


  function swatchButtonGenerator(swatches, groupId, variationId) {
    let buttons = '';

    swatches.forEach((swatch, index) => {

      if (swatch.inStock) {


        if (parseInt(variationId) === swatch.variationId) {

          buttons = buttons + `<button class='wizzy-quick-view-swatch-button isSelected' variation-id='${swatch.variationId}' group-id='${groupId}'> ${swatch.value} </button>`
        }
        else {
          buttons = buttons + `<button class='wizzy-quick-view-swatch-button' variation-id='${swatch.variationId}' group-id='${groupId}'> ${swatch.value} </button>`
        }
      }
    })

    return buttons;
  }

  function QuickViewSwatchButtonListender() {
    $('.wizzy-quick-view-swatch-button').on('click', function () {
      quickViewButtonUnselect();
      $(this).addClass('isSelected');
      let varientId = $(this).attr('variation-id');
      let groupId = $(this).attr('group-id');
      getVarientData(groupId, varientId);
      $('.wizzy-quick-view-add-to-cart').attr('id', varientId)
    })
  }

  function setImages(mainImage, otherImages) {

    $('.wizzy-img-container-main').html(`<img src='${mainImage}' />`);
    let otherImagesString = ''
    otherImages.forEach((item) => {
      otherImagesString = otherImagesString + `<img class='wizzy-quick-view-other-images' src=${item} />`
    })



    $('.wizzy-img-container-other-image').html(otherImagesString)
    otherImageClickListners();
  }


  function addQuantity() {
    $('.wizzy-quick-view-quantity-increase').on('click', function () {
      $('.wizzy-quick-view-quantity-display').text(parseInt($('.wizzy-quick-view-quantity-display').text()) + 1);
    })
  }

  function removeQuantity() {
    $('.wizzy-quick-view-decrease').on('click', function () {
      if (parseInt($('.wizzy-quick-view-quantity-display').text()) <= 1) {
        return
      }
      $('.wizzy-quick-view-quantity-display').text(parseInt($('.wizzy-quick-view-quantity-display').text()) - 1);
    })
  }

  function addToCartQuickViewID(id) {

    $('.wizzy-quick-view-add-to-cart').attr('id', id)
    $('.wizzy-quick-view-add-to-cart').on('click', function () {
      var sel_pro_name = $('.wizzy-quick-view-title p').text().trim();
      var sel_pro_price = $('.wizzy-quick-view-price').text().trim();
      var sel_pro_qty = $('.wizzy-quick-view-quantity-display').text().trim();
      sel_pro_price = sel_pro_price.replace('₹  ', '');

      gtag("event", "add_to_cart", {
        currency: "INR",
        value: Shopify.formatMoney(sel_pro_price, theme.moneyFormat),
        items: [
          {
            item_name: sel_pro_name,
            price: Shopify.formatMoney(sel_pro_price, theme.moneyFormat),
            quantity: sel_pro_qty
          }
        ]
      });
      callAJAXApi($(this).attr('id'), $('.wizzy-quick-view-quantity-display').text());

    })
  }

  function quickViewPriceSet(originalPrice, price) {

    if (originalPrice) {

      $('.wizzy-quick-view-original-price').text('₹  ' + originalPrice);
    }

    $('.wizzy-quick-view-price').text('₹  ' + price);

  }

  function quickViewtitleSet(title) {

    $('.wizzy-quick-view-title p').text(title);
  }

  function setQuickViewRating(reviewcount, star) {


    let [noOfFullStars, noOfHalfStars, noOfEmptyStars] = numberofStars(star)
    let string = starMarkUp(noOfFullStars, noOfHalfStars, noOfEmptyStars)
    $('.wizzy-quick-view-reviews').html(string);
  }

  function quickViewButtonUnselect() {
    $('.wizzy-quick-view-swatch-button').each(function (index, element) {
      $(element).removeClass('isSelected')
        ;
    })
  }

  function otherImageClickListners() {
    $('.wizzy-img-container-other-image img').on('click', function () {
      $('.wizzy-img-container-main img').attr('src', $(this).attr('src'))
      $('.wizzy-img-container-other-image img').each(function (index, element) {
        $(element).removeClass('isSelected');
      })
      $(this).addClass('isSelected');
    })
  }

  function setBuyNowURL(id) {
    $('.wizzy-quick-view-buy-now').attr('href', `https://nestasia.in/cart/${id}:1?traffic_source=buy_now`)
  }

  function removeAttchedEventQuantity() {
    // $('.wizzy-quick-view-decrease').off();

  }

  function resetCartQuantity() {

    $('.wizzy-quick-view-quantity-display').text(1);
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutationRecord) {

      setTimeout(function () { $('.wizzy-autocomplete-wrapper').css('display', 'none') }, 500)

    });
  });


  // edited
  // var target = document.getElementsByClassName('header-searchbar')[0];
  // observer.observe(target, { attributes: true, attributeFilter: ['class'] });






  var observer2 = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutationRecord) {

      if ($('.responsiveMenuWrapper').hasClass('active')) {

        $('.back-to-top').css('z-index', '-1')
        $('.wizzy-filters-mobile-entry').css('z-index', '00000')
      }
      else {

        $('.wizzy-filters-mobile-entry').css('z-index', '100000')
        $('.back-to-top').css('z-index', '99999')
      }

    });
  });


  // edited
  // var target2 = document.getElementsByClassName('responsiveMenuWrapper')[0];
  // observer2.observe(target2, { attributes: true, attributeFilter: ['class'] });


  function autofillInMobile() {
    $('body').on('click', '.autocomplete-text-wrapper', function () {

      var b = $(this).parent().attr('data-searchterm');
      setTimeout(function () {

        document.getElementsByClassName("wizzy-search-form-wrapper")[0].classList.add("mobileTapped");
        document.getElementsByClassName("input-text search-query wizzy-search-input")[0].click();

        $('.input-text.search-query.wizzy-search-input').val(b)
      }, 500)

    })
  }

  function numberofStars(stars) {

    let noOfFullStars = 0;
    let noOfHalfStars = 0;
    let noOfEmptyStars = 5;

    noOfFullStars = parseInt(stars);
    if (stars - parseInt(stars)) {
      noOfHalfStars++;
    }
    noOfEmptyStars = 5 - noOfFullStars - noOfHalfStars;

    return [noOfFullStars, noOfHalfStars, noOfEmptyStars]
  }


  function starMarkUp(noOfFullStars, noOfHalfStars, noOfEmptyStars) {
    let fullString = ``
    let halfString = ``
    let emptyString = ``



    for (let i = 0; i < noOfFullStars; i++) {
      fullString = fullString + `<span class="jdgm-star jdgm--on"></span>`
    }

    for (let j = 0; j < noOfHalfStars; j++) {
      halfString = halfString + `<span class="jdgm-star jdgm--half"></span>`
    }

    for (let k = 0; k < noOfEmptyStars; k++) {
      emptyString = emptyString + `<span class="jdgm-star jdgm--half"></span>`
    }

    return fullString + halfString + emptyString;


  }

  function renderStars() {
    $('.wizzy-result-product').each(function (index, element) {

      if ($(element).find('.jdgm-prev-badge__stars').attr("starmarkup")) {

        $(element).find('.jdgm-prev-badge__stars').html($(element).find('.jdgm-prev-badge__stars').attr("starmarkup"))
      }
    })


  }

  function renderStarsAutoComplete() {
    $('.topproduct-item').each(function (index, element) {

      if ($(element).find('.jdgm-prev-badge__stars').attr("starmarkup")) {

        $(element).find('.jdgm-prev-badge__stars').html($(element).find('.jdgm-prev-badge__stars').attr("starmarkup"))
      }
    })
  }

  function isOfferAvailable(arr) {
    let isTrue = false;
    arr.forEach((item) => {

      if (item.trim() === 'display_offers available') {
        isTrue = true
      }
    })
    return isTrue
  }


  function allCollectionRedirect() {
    const currentURL = window.location.href;
    if (currentURL.endsWith("/all")) {
      window.location.href = currentURL.replace("/all", "/all-products");
    }
  }



}