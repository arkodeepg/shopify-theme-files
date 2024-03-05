theme.Password = (function() {
  function Password(container) {
    let vh = window.innerHeight;
    var p = document.querySelector('.password');
    var pp = document.querySelector('.password-page');
    p.style.height = vh + 'px';
    pp.style.height = vh + 'px';
    window.onresize = function(){
      let vh = window.innerHeight;
      p.style.height = vh + 'px';
      pp.style.height = vh + 'px';
    };
  var el = document.querySelectorAll('.password-links button');
  el.forEach(function(e) {
    e.onclick = function(ev){
      const pw = e.getAttribute('data-micromodal-trigger');
      const m = document.getElementById(pw); 
      const mc = m.querySelector('.modal-container'); 
      const mcC = mc.querySelector('.modal-content'); 
      const aB = document.getElementById('ajaxBusy');
      try {
        MicroModal.show(pw, {
          onShow: function(modal) {
            m.classList.add('loaded');
            mc.classList.add('loaded');
            aB.style.display = 'block';
            document.body.classList.add('modal-active-pw');              
          },
          onClose: function(modal) {
            setTimeout(function() {
              m.classList.remove('loaded');
              document.body.classList.remove('modal-active-pw');
            }, 250);
            mc.classList.remove('loaded');
            aB.style.display = 'none';
          },
          disableScroll: true
        });
      } catch (e) {
        console.log("micromodal error: ", e);
      }
    };
  });
  }
  return Password;
})();