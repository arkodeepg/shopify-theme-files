function Filter(container) {
  var sectionId = container.getAttribute('data-section-id'),
      dT = container.getAttribute('data-tag'),
      fF = container.querySelector('.filter-form-' + sectionId),
      fFD = fF.querySelectorAll('details'),
      s0 = document.getElementById('select_0_' + sectionId),
      col = s0.getAttribute('data-columns'),
      s1 = document.getElementById('select_1_' + sectionId),
      s2 = document.getElementById('select_2_' + sectionId),
      s3 = document.getElementById('select_3_' + sectionId),
      nS = fF.querySelectorAll('.no-select'),
      uOa = container.querySelectorAll('ul.options'),
      asF = container.querySelector('.animate-section'),
      aFA = container.querySelectorAll('.animate-filter');
  var dropDowns = function () {
    for (var i = 0; i < 4; i++) {
      var sL = fF.querySelectorAll('#select_' + i + '_' + sectionId);
      sL.forEach(function(f) {
        var s = f.querySelector('select'),
            sO = s.querySelectorAll('option'),
            aD = f.querySelector('details'),
            asS = f.querySelector('.styledSelect'),
            uO = f.querySelector('ul.options'),
            uOAa = uO.querySelectorAll('button'),
            aF = f.closest('.animate-filter');
        asS.onclick = function(ev){
          if (asF) {
            asF.classList.add('filter-loaded');
          }
          aFA.forEach(function(a) {
            a.classList.remove('filter-open');
          });
          aF.classList.toggle('filter-open');
        };
        fFD.forEach(function(f) {
          f.onclick = function(ev){
            if (this.open) {
              fFD.forEach(deet=>{if (deet!=this && deet.open) deet.open = false});
              setTimeout(function() {
                if (asF) {
                  asF.classList.remove('filter-loaded');
                }
              }, 250);
            }
          };
        });
        uOAa.forEach(function(u) {
          u.onclick = function(ev){
            asS.textContent = u.textContent;
            sO.forEach(function(s) {              
              if (s.value == u.getAttribute('rel') && s.dataset.id == u.getAttribute('data-id')) {
                s.selected = 'selected';
              }
            });
            aD.open = false;  
            setTimeout(function() {
              if (asF) {              
                asF.classList.remove('filter-loaded');
              }
            }, 250);  
            s.dispatchEvent(new Event('change'));
          };
        });
      }); 
    };
  }
  var forLoop = function (number, d) {
    for (var i = number; i < col; i++) {
      var sL = document.querySelector('#select_' + i + '_' + sectionId);
      if (dT != 'menu') { 
        var lI = d.querySelectorAll('li');
        var oP = d.querySelectorAll('option');
      } else {
        var lI = sL.querySelectorAll('li');
        var oP = sL.querySelectorAll('option');
      }      
      var sLtS = sL.querySelector('span.tag-select');
      var sLO = sL.querySelector('select');
      var sLOo = sLO.querySelectorAll('option:not(.first)');
      var sLOf = sLO.querySelector('option.first').getAttribute('data-select');
      var sLUs = sL.querySelector('summary');
      var sLU = sL.querySelector('ul');
      var sLUlf = sLU.querySelector('li.first');
      var sLUl = sLU.querySelectorAll('li:not(.first)');
      var tag = fF.querySelector('#directory_label_0_' + sectionId).options[fF.querySelector('#directory_label_0_' + sectionId).selectedIndex].getAttribute('data-tag-' + i);
      if (dT == 'menu' && number == '2') {
        var tag = fF.querySelector('#directory_label_1_' + sectionId).options[fF.querySelector('#directory_label_1_' + sectionId).selectedIndex].getAttribute('data-sub-group');
        var sA = 'data-sub-sub-group';
        sL.setAttribute('data-tag',tag)
      } else {
        var tag = fF.querySelector('#directory_label_0_' + sectionId).options[fF.querySelector('#directory_label_0_' + sectionId).selectedIndex].getAttribute('data-tag-' + i);
        var sA = 'data-group';
        sL.setAttribute('data-tag',tag)
      }
      sLO.value = '';
      sLUs.textContent = theme.language.layout_general_unavailable;
      sLO.setAttribute('disabled','disabled');
      sLtS.classList.add('disabled');
      sLtS.classList.remove('enabled');
      sLOo.forEach(function(o) {
        if (dT != 'menu') {
          o.remove();
        } else {
          o.classList.add('hidden');
        }
      });
      sLUl.forEach(function(l) {
        if (dT != 'menu') {
          l.remove();
        } else {
          l.classList.add('hidden');
        }
      });
      if (sL.getAttribute('data-tag')) {
        oP.forEach(function(o) {
          if (o.getAttribute(sA) == tag) {
            if (dT != 'menu') {
              sLO.appendChild(o);
            } else {
              o.classList.remove('hidden');
            }
          }
        });
        if (dT != 'menu') {
          sLUlf.textContent = tag + '...';
          sLUs.textContent = tag + '...';
        } else {
          sLUlf.textContent = sLOf;
          sLUs.textContent = sLOf;
        }
        lI.forEach(function(l) {
          if (l.getAttribute(sA) == tag) {
            if (dT != 'menu') {
              sLU.appendChild(l);
            } else {
              l.classList.remove('hidden');
            }
            sLtS.classList.remove('disabled');
            sLtS.classList.add('enabled');
          }
        });
      }
    };
  }
  document.onclick = function(ev){
    var dO = fF.querySelector('details[open]');
    if (dO) {
      var idO = dO.contains(ev.target);
      if (!idO) {
        dO.open = false      
        setTimeout(function() {
          if (asF) {        
            asF.classList.remove('filter-loaded');
          }
        }, 250);
      }
    }
  }
  var ajaxLoadPage = function (number) {
    var filters = [];
    fFD.forEach(function(f) {
      f.open = false; 
      setTimeout(function() {
        if (asF) {             
          asF.classList.remove('filter-loaded');
        }
      }, 250);
    });
    nS.forEach(function(n) {
      filters.push(n.options[n.selectedIndex].value);
      n.classList.remove('last');
    });
    if (dT != 'menu') {
      if (dT == 'true') {
        var url = (filters.join('')) + '?view=do_not_use';
      } else {
        var url = (filters.join('')) + 'view=do_not_use';
      }
      fetch(url)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        const d = htmlDocument.documentElement.querySelector('div');
        forLoop(number, d);
        dropDowns();
      });
    } else {
      forLoop(number);
      dropDowns();
    }
  }
  dropDowns();
  if (fF.querySelector('#directory_label_0_' + sectionId)) {
    fF.querySelector('#directory_label_0_' + sectionId).onchange = function(){
      if (s1) {
        s1.querySelector('.no-select').value = '';
      }
      if (s2) {
        s2.querySelector('.no-select').value = '';
      }
      if (s3) {
        s3.querySelector('.no-select').value = '';
      }
      var number = 1
      ajaxLoadPage(number);
      this.classList.add('last');
      if (s0.querySelector('li.first')) {
        s0.querySelector('li.first').classList.remove('hidden');
      }
      s0.querySelector('.error').style.display = 'none';
    };
  }
  if (fF.querySelector('#directory_label_1_' + sectionId)) {
    fF.querySelector('#directory_label_1_' + sectionId).onchange = function(){
      if (s2) {
        s2.querySelector('.no-select').value = '';
      }
      if (s3) {
        s3.querySelector('.no-select').value = '';
      }
      var number = 2
      ajaxLoadPage(number);
      this.classList.add('last');        
      if (s1.querySelector('li.first')) {
        s1.querySelector('li.first').classList.remove('hidden');
      }
    };
  }
  if (fF.querySelector('#directory_label_2_' + sectionId)) {
    fF.querySelector('#directory_label_2_' + sectionId).onchange = function(){
      if (s3) {
        s3.querySelector('.no-select').value = '';
      }
      var number = 3
      ajaxLoadPage(number);
      this.classList.add('last');        
      if (s2.querySelector('li.first')) {
        s2.querySelector('li.first').classList.remove('hidden');
      }
    };
  }
  if (fF.querySelector('#directory_label_3_' + sectionId)) {
    fF.querySelector('#directory_label_3_' + sectionId).onchange = function(){
      this.classList.add('last');        
      if (s3.querySelector('li.first')) {
        s3.querySelector('li.first').classList.remove('hidden');
      }
    };
  }
  fF.querySelector('.btn').onclick = function(ev){
    if(fF.querySelector('#directory_label_0_' + sectionId).selectedIndex == 0) {
      var asF = fF.querySelector('.animate-section.filter');
      fF.querySelector('.select .error').style.display = 'block';
      if(asF) {
        asF.classList.add('loaded');
      }
    } else {
      if (this.classList.contains('advanced')) {
        var filters = [];      
        nS.forEach(function(n) {
          filters.push(n.options[n.selectedIndex].value);
        });
        window.location = ('/' + filters.join('').slice(1,-1));
      } else {
        var url = fF.querySelector('.no-select.last');
        window.location = (url.options[url.selectedIndex].value);
      }        
      fF.querySelector('.select .error').style.display = 'none';
    }
  }
}

document.addEventListener('Section:Loaded', function(event){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  if(sectionType === 'filter'){
    Filter(sectionContainer);
  }
})

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'filter' && !sectionContainer.classList.contains('ignore')){
    Filter(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})