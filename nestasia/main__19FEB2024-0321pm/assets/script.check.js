let body = document.getElementById('main-body')
theme.breakpoint = 600;
function Theme_Width(b) {
  theme.height = window.innerHeight;
  theme.width = body.scrollWidth;
  theme.breakpoint_margin = 600 - (window.innerWidth - document.documentElement.clientWidth);
};
Theme_Width(body);
function Details_Open(b) {
  var iW = theme.width,
      dO = b.querySelectorAll('.open-container.desktop > details');
  if (iW <= theme.breakpoint_margin) {
    dO.forEach(function(d) {
      d.open = false;
    });
  } else {
    dO.forEach(function(d) {
      d.open = true;
    });
  }
};
var header = document.querySelector('header');
if(('ontouchstart' in document.documentElement) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)){
  theme.detectmob = true;
} else {
  theme.detectmob = false;
}
if (theme.detectmob) { 
  body.classList.add('true-mobile');
}
Details_Open(body);
var cW = window.innerWidth;
if (!header) {
  document.selectors = {
    sht: 0
  };
  theme.multiHead = 'false';
  window.addEventListener('resize', function(b) {  
    if (cW == window.innerWidth) {
      return;
    }
    cW = window.innerWidth;
    var body = document.body;    
    Theme_Width(body);
    Details_Open(body);
  });
  body.classList.remove('loading');
};
window.addEventListener('resize', function(b) {
  if (cW == window.innerWidth) {
    return;
  }
  cW = window.innerWidth;
  var body = document.body;
  Theme_Width(body);
  Details_Open(body);
});