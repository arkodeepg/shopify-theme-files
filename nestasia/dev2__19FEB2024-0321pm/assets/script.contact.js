theme.Contact = (function() {
  function Contact(container) {     
    var sectionId = container.getAttribute('data-section-id');
    var c = container.querySelectorAll('.checkboxes');
    function getVal() {
      c.forEach(function(cs) {
      let r = [];
        var b = cs.querySelectorAll('input[type="checkbox"]');
        var h = cs.querySelector('input[type="hidden"]');
        b.forEach(i => {
          if (i.checked) {
            r.push(i.value);
          }
        })
        var v = r.join(', ');
        h.value = v;
      });
    }
    var hny = document.getElementById('honeypot'),
        btn = hny.querySelector('.btn-replace');
    btn.remove();
    hny.innerHTML = '<input class="btn standard-width bottompad" type="submit" value="' + theme.language.contact_form_send + '" id="contactFormSubmit" />';    
    document.getElementById('contactFormSubmit').onclick = function(ev){
      getVal();
      if (document.getElementById('contactFormNumber').value.length > 0) {
        ev.preventDefault();
      }
    }
  }
  return Contact;
})();