theme.PopUp = (function() {
  function PopUp(container) {
    var sectionId = container.getAttribute('data-section-id');
    const m = document.querySelector('#popup'); 
    const mc = m.querySelector('.modal-container'); 
    const aB = document.getElementById('ajaxBusy');
    var d = container.getAttribute('data-days');
    var pC = document.getElementById('popCheckbox');
    var pCc = container.querySelectorAll('.popCheckbox');
    var f = container.querySelector('.feedback');
    var hny = document.getElementById('pop-honeypot');
    if (hny) {
      hny.innerHTML = '<input class="btn auto-width" type="submit" value="' + theme.language.contact_form_send + '" id="popSubmit" />';
      document.getElementById('popSubmit').onclick = function(ev){
        if (document.getElementById('popNumber').value.length > 0) {
          ev.preventDefault();
        } else {        
          document.cookie="AveForm=popUp";
        }
      }
    }
    function popUp() {
      document.cookie="AveForm=popUp;max-age=0";
      try {
        MicroModal.show('popup', {
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
    }
    //	Based on https://medium.com/weekly-webtips/how-to-make-an-effective-exit-intent-popup-in-javascript-bf6051b4a6d4
    if (!Shopify.designMode && !f) {
      const cS = {
        setCookie(name, value, days) {
          let expires = '';
          if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
          }
          document.cookie = name + '=' + (value || '')  + expires + ';';
        },
        getCookie(name) {
          const cc = document.cookie.split(';');
          for (const c of cc) {
            if (c.indexOf(name + '=') > -1) {
              return c.split('=')[1];
            }
          }
          return null;
        }
      }
      const mouseEvent = e => {
        const eX = 
              !e.toElement && 
              !e.relatedTarget &&
              e.clientY < 10;
        if (eX) {
          document.removeEventListener('mouseout', mouseEvent);
          popUp();
          if (d > 0) {
            cS.setCookie('exitIntentShown', true, d);
          }
        }
      };
      if (d > 0) {
        if (!cS.getCookie('exitIntentShown')) {
          setTimeout(function() {
            document.addEventListener('mouseout', mouseEvent);
          }, 10000);
        }
      } else {
        setTimeout(function() {
          document.addEventListener('mouseout', mouseEvent);
        }, 10000);
      }
      if (pCc) {
        pCc.forEach(function(c) {
          c.onchange = function(){
            pC.value = ""
            var i;
            for (i = 0; i < pCc.length; i++) {
              var x = pCc[i];
              if(x.checked){
                if(pC.value==""){
                  pC.value = x.value;
                }else{
                  pC.value = pC.value + ", " + x.value; 
                } 
              }
            }
          }
        });
      }
    }
    if (f && document.cookie.split('AveForm=popUp').length == 2) {
      popUp();
      if (document.querySelector('#contact_form .feedback')) {
        document.querySelector('#contact_form .feedback').classList.add('hidden');
      }
    }
    PopUp.prototype.onBlockSelect = function(ev) {
      popUp();
    }
    PopUp.prototype.onSelect = function(ev) {
      popUp();
    }
    PopUp.prototype.onDeselect = function(ev) {
      setTimeout(function() {
        m.classList.remove('loaded');
        document.body.classList.remove('modal-active');
      }, 250);
      mc.classList.remove('loaded');
      aB.style.display = 'none';
    }
  }
  return PopUp;
})();