function CartReload(data) {
  var container = document.getElementById('cart-table')
  var tT = document.getElementById('total-top');
  var c = document.querySelector('.cart-table');
  var tB = document.getElementById('total-bottom');
  const parser = new DOMParser();
  const htmlDocument = parser.parseFromString(data, 'text/html');
  var nTT = htmlDocument.documentElement.querySelector('#total-top');
  var nC = htmlDocument.documentElement.querySelector('.cart-table');
  var nTB = htmlDocument.documentElement.querySelector('#total-bottom');
  tT.replaceWith(nTT);
  c.replaceWith(nC);
  tB.replaceWith(nTB);  
  container.querySelector('.full-form').classList.remove('hidden');
  container.querySelector('.empty-form').classList.add('hidden');
  Quantity(container);
  CartButtons();
}

function CartChange(q,container) {
  var header = document.querySelector('header');
  var it = q.closest('.item');
  var id = it.getAttribute('data-product-id');
  var q =  it.querySelector('.item-qty').value;
  var iQ = it.querySelector('.item-qty');
  var s = it.querySelector('.error');
  var rct = container.getAttribute('data-recent');
  var aB = document.getElementById('ajaxBusy');
  var cTa = document.getElementById('cart-table');
  var cC = document.querySelectorAll('.cartCountSelector');
  var cT = document.querySelector('.cartTotalSelector');
  var tT = document.getElementById('total-cart-top');
  var c = document.querySelector('.cart-table');
  var tC = document.getElementById('cart-total');
  var tB = document.getElementById('total-cart-bottom');
  var dC = document.querySelector('.discount-cart');
  var aS = document.querySelector('.animate-section'); 
  var cD = document.getElementById('cart-dropdown');
  if (q != '') {
    aB.style.display = 'block';
  }
  fetch(theme.routes_cart_change_url + '.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'quantity': q,'id':id})
  }).then(function(r) {
    return r.json();
  }).then(function(j) {
    if (q != '') {
      cC.forEach(function(c) {
        c.textContent = j.item_count;
      });
      if (header) {
        cT.innerHTML = Shopify.formatMoney(j.total_price, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
        tT.innerHTML = Shopify.formatMoney(j.total_price, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
      }
      if (j.cart_level_discount_applications && j.cart_level_discount_applications.length > 0) {
        tC.innerHTML = Shopify.formatMoney(j.items_subtotal_price, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
        dC.innerHTML = Shopify.formatMoney('-' + j.total_discount, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
      }
      tB.innerHTML = Shopify.formatMoney(j.total_price, theme.moneyFormat).replace(/((\,00)|(\.00))$/g, '');
    }    
    if (j.item_count == 0) {
      ShippingMsg();
      cTa.querySelector('.full-form').classList.add('hidden');
      cTa.querySelector('.empty-form').classList.remove('hidden');
      aB.style.display = 'none';
      if (theme.dropdown == true) {
        document.querySelector('.cart-count-mobile').setAttribute('href', theme.routes_cart_url);
        document.querySelector('.cart-count-mobile').classList.remove('void');
      }
      if (cD) {
        cD.remove();
      }
      if(rct == 'true' && aS){
        document.querySelector('.animate-section').classList.add('go','up');
      };
    } else {
      var x = theme.cart;
      CartDrop(x);
      fetch(theme.routes_cart_url)
      .then(response => response.text())
      .then(data => {
        if (q != '') {
          if (q == 0) {
            it.remove();
          }
          CartReload(data)
          aB.style.display = 'none';
        }        
      }).catch(function(err) {
        console.error('!: ' + err)
      });
    };
  }).catch(function(err) {
    console.error('!: ' + err)
  });
}

function CartButtons() {
  var container = document.getElementById('cart-table'),
      qB = container.querySelectorAll('.qtybtn');
  qB.forEach(function(q) {
    if (q.classList.contains('icon-plus')) {
      var qF = q.closest('.quantity.form'),
          vV = qF.querySelector('.item-qty').value,
          vM = qF.querySelector('.item-qty').getAttribute('max');
    };
    setTimeout(function () {
      q.onclick = function(ev){
        if (vM && vM == vV) {
          return;
        }
        CartChange(q,container);
      }
    }, 1);
  })  
  var qI = container.querySelectorAll('.item-qty');
  qI.forEach(function(q) {
    let timeout;
    var vV = q.value,
        vM = q.getAttribute('max');
    q.addEventListener('keyup', function (e) {
      if (e.key == 'Tab' || e.key == 'Shift') return;
      var nV = q.value;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        if (vM && nV == vV && vM == nV) {
          return;
        }
        CartChange(q,container);
      }, 750);
    });
  });  
}

theme.CartPage = (function() {
  function CartPage(container) {
    var sectionId = container.getAttribute('data-section-id');
    var chk = container.getAttribute('data-check');
    var rct = container.getAttribute('data-recent');
    var rV = document.getElementById('recently-viewed');
    var rVP = document.getElementById('recently-viewed-placeholder');
    theme.cart = true;
    Quantity(container);
    if(chk == 'true'){      
      var nC = container.querySelector('[name="checkout"]');
      document.getElementById('cart-terms').onclick = function(ev){
        if (this.checked == true) {
          nC.classList.remove('outline');
          nC.removeAttribute('disabled');
          nC.setAttribute('aria-label', theme.language.cart_general_checkout);
          nC.value = theme.language.cart_general_checkout;
          nC.textContent = theme.language.cart_general_checkout;
        } else {
          nC.classList.add('outline');
          nC.setAttribute('disabled', true);
          nC.setAttribute('aria-label', theme.language.cart_general_agree);
          nC.value = theme.language.cart_general_agree;
          nC.textContent = theme.language.cart_general_agree;
        }
      };
    };
    CartButtons(container);
    if(rct == 'true'){
      function gPD (){
        const pD = JSON.parse(localStorage.getItem('rVP'));
        const rVH = []
        if (pD) {
          rV.classList.remove('hidden');          
          pD.forEach(function(item,i){
            rVH.push('id:' + item.pID);
          });
          const rB = rVH.join('%20OR%20');
          fetch(theme.routes_search_url + '?section_id=recently-viewed&q=' + rB + '&type=product')
          .then(response => response.text())
          .then(data => {   
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(data, 'text/html');
            var rVD = document.querySelector('.recently-viewed');
            var cP = htmlDocument.documentElement.querySelector('.collection-products');
            rVP.remove();
            rVD.appendChild(cP);
            if (theme.settings.quickView) {
              Quick();
            };
            if (theme.settings.compare) {
              CompareProducts();
            };
            Swatches(container);
            if (theme.settings.cart) {
              var sI = cP.getAttribute('data-section-id');
              Cart(container,sI);
            }
          }).catch(function (err) {
            console.log('!: ' + err);
          });
        }
      }    
      gPD();
    };
    if (Shopify && Shopify.StorefrontExpressButtons) {
      Shopify.StorefrontExpressButtons.initialize();
    }
  }
  return CartPage;
})();