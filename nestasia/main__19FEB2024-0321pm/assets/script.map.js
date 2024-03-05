var apiStatus = null;
var mapsToLoad = [];
function MapMap(container) {
  var sectionId = container.getAttribute('data-section-id');
  var k = container.getAttribute('data-key');
  var mc = document.getElementById('map-container-' + sectionId);
  var m = document.getElementById('map-' + sectionId);
  var l = mc.querySelector('.loader');
  this.selectors = {
    mc: mc,
    m: m,
    l: l,
    z: m.getAttribute('data-zoom'),      
    a: m.getAttribute('data-address'),
    i: m.getAttribute('data-icons'),
    altf: m.getAttribute('data-altf'),
    alts: m.getAttribute('data-alts'),
    lmgf: m.getAttribute('data-lmgf'),
    lngf: m.getAttribute('data-lngf'),
    lltf: m.getAttribute('data-lltf'),
    llts: m.getAttribute('data-llts'),
    pgf: m.getAttribute('data-pgf'),
    pltf: m.getAttribute('data-pltf'),
    plts: m.getAttribute('data-plts'),
    pli: m.getAttribute('data-pli'),
    ragf: m.getAttribute('data-ragf'),
    rags: m.getAttribute('data-rags'),
    raltf: m.getAttribute('data-raltf'),
    ralts: m.getAttribute('data-ralts'),
    rhgf: m.getAttribute('data-rhgf'),
    rhgs: m.getAttribute('data-rhgs'),
    rhltf: m.getAttribute('data-rhltf'),
    rhlts: m.getAttribute('data-rhlts'),
    rlgf: m.getAttribute('data-rlgf'),
    rlgs: m.getAttribute('data-rlgs'),
    rlltf: m.getAttribute('data-rlltf'),
    rllts: m.getAttribute('data-rllts'),
    tlgf: m.getAttribute('data-tlgf'),
    tlltf: m.getAttribute('data-tlltf'),
    tllts: m.getAttribute('data-tllts'),
    tsgf: m.getAttribute('data-tsgf'),
    tsltf: m.getAttribute('data-tsltf'),
    tslts: m.getAttribute('data-tslts'),
    tli: m.getAttribute('data-tli'),
    wgf: m.getAttribute('data-wgf'),
    wlt: m.getAttribute('data-wlt')      
  }
  window.gm_authFailure = function() {
    mc.remove();
    l.remove();
  };
  if (!m) return;
  if (typeof k === 'undefined') {
    return;
  }
  if (apiStatus === 'loaded') {
    this.createMap();
  } else {
    mapsToLoad.push(this);
    if (apiStatus !== 'loading') {
      apiStatus = 'loading';
      if (typeof window.google === 'undefined') {
        theme.Helpers.getScript(
          'https://maps.googleapis.com/maps/api/js?key=' + k
        ).then(function() {
          apiStatus = 'loaded';
          initAllMaps();
        });
      }
    }
  }
}
function initAllMaps() {
  mapsToLoad.forEach(function(map) {
    map.createMap();
  });
}
function geolocate(map) {
  return new Promise(function(resolve, reject) {
    var geocoder = new google.maps.Geocoder();
    var address = map.dataset.address;
    geocoder.geocode({ address: address }, function(results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        reject(status);
      }
      resolve(results);
    });
  });
}
function createMap() {
  return geolocate(this.selectors.m)
  .then(
    function(results) {
      var mapOptions = {
        zoom: parseInt(this.selectors.z),
        center: results[0].geometry.location,
        draggable: true,
        clickableIcons: true,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        styles: [
          {
            "elementType": "labels.icon",
            "stylers": [{"visibility": this.selectors.i}]
          },
          {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": this.selectors.altf
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": this.selectors.alts
              }
            ]
          },
          {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": this.selectors.lmgf
              }
            ]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": this.selectors.lngf
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": this.selectors.lltf
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": this.selectors.llts
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": this.selectors.pgf
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": this.selectors.pltf
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": this.selectors.plts
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.icon",
            "stylers": [
              {
                "color": this.selectors.pli
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": this.selectors.ragf
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": this.selectors.rags
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": this.selectors.raltf
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": this.selectors.ralts
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": this.selectors.rhgf
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": this.selectors.rhgs
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": this.selectors.rhltf
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": this.selectors.rhlts
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": this.selectors.rlgf
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": this.selectors.rlgs
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": this.selectors.rlltf
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": this.selectors.rllts
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": this.selectors.tlgf
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": this.selectors.tlltf
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": this.selectors.tllts
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": this.selectors.tsgf
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": this.selectors.tsltf
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": this.selectors.tslts
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.icon",
            "stylers": [
              {
                "color": this.selectors.tli
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": this.selectors.wgf
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
              {
                "color": this.selectors.wlt
              }
            ]
          }
        ]
      };
      var map = (this.selectors.m = new google.maps.Map(this.selectors.m, mapOptions));
      var center = (this.center = map.getCenter());
      var marker = new google.maps.Marker({
        map: map,
        position: map.getCenter()
      });
      var a = this.selectors.a;
      marker.addListener('click', function() {
        window.open('https://www.google.com/maps/search/?api=1&query=' + a, '_blank')
      });
      this.selectors.l.remove();
      google.maps.event.addDomListener(
        window,
        'resize',
        theme.Helpers.debounce(
          function() {
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
          }.bind(this),
          250
        )
      );
    }.bind(this)
  );
}

document.addEventListener('Section:Loaded', function(event){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  if(sectionType === 'map'){
    MapMap(sectionContainer);
  }
})

sectionEvents.forEach(function(sectionEvent){
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'map' && !sectionContainer.classList.contains('ignore')){
    MapMap(sectionContainer);
    sectionContainer.classList.add('ignore');
  }
})