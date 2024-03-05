theme.customerTemplates = (function() {
  var cl = document.getElementById('customer_login');
  var rp = document.getElementById('recover_password');
  var re = document.getElementById('recover-email');
  var rs = document.getElementById('resetSuccess');
  var aa = document.getElementById('add_address');
  var aB = document.getElementById('ajaxBusy');
  function toggleRecoverPasswordForm() {
    rp.classList.toggle('hidden');
    cl.classList.toggle('hidden');
  }
  function initEventListeners() {
    var el = document.querySelectorAll('#recover_password_btn,#customer_login_btn');
    el.forEach(function(e) {
      e.onclick = function(ev) {
        toggleRecoverPasswordForm();
      };
    });
  }
  function resetPasswordSuccess() {
    var fS = document.querySelector('.reset');
    if (!fS) {
      return;
    }
    if (re.classList.contains('reset-success')) {
      rs.classList.remove('hidden');
    }
    if (re.classList.contains('reset-error')) {
      rp.classList.remove('hidden');
      cl.classList.add('hidden');
    };
  }
  function customerAddressForm() {
    if (!aa) {
      return;
    }
    if (Shopify) {
      new Shopify.CountryProvinceSelector(
        'address_country_new',
        'address_province_new',
        {
          hideElement: 'address_province_container_new'
        }
      );
    }
    var el = document.querySelectorAll('.address_country_option');
    el.forEach(function(e) {
      var formId = e.dataset.formId;
      var countrySelector = 'address_country_' + formId;
      var provinceSelector = 'address_province_' + formId;
      var containerSelector = 'address_province_container_' + formId;
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });
    document.getElementById('add_address_btn').onclick = function(ev) {
      var a = document.getElementById('add_address');
      a.classList.toggle('hidden');
      document.getElementById('address_first_name_new').focus();      
      var s = a.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
    };
    document.getElementById('add_address_cancel').onclick = function(ev) {
      window.scrollTo({top:0, behavior: 'smooth'});
      document.getElementById('add_address').classList.add('hidden');
    };
    document.querySelectorAll('.edit_address').forEach(function(b) {
      b.onclick = function(ev) {
        var iD = b.getAttribute('data-form-id');
        var vA = document.getElementById('view_address_' + iD);
        var eA = document.getElementById('edit_address_' + iD);
        if (b.classList.contains('account-secondary')) {
          var s = eA.getBoundingClientRect().top + window.pageYOffset;
        } else {
          var s = vA.getBoundingClientRect().top + window.pageYOffset;
        }
        window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});
        vA.classList.toggle('hidden');
        eA.classList.toggle('hidden');
      };
    });    
    document.querySelectorAll('.edit_address_delete').forEach(function(b) {
      b.onclick = function(ev) {
        var t = b.getAttribute('data-target');
        var m = b.getAttribute('data-confirm');
        if (b.classList.contains('edit_address_confirm')) {
          Shopify.postLink(t, {
            parameters: { _method: 'delete' }
          });
          aB.style.display = 'block';
        } else {
          b.textContent = m;
          b.classList.add('edit_address_confirm','error-text');
        }
      };
    });
    document.querySelectorAll('.address_btn').forEach(function(b) {
      b.onclick = function(ev) {
        aB.style.display = 'block';
      };
    });
  }  
  return {
    init: function() {
      initEventListeners();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();

theme.customerTemplates.init();