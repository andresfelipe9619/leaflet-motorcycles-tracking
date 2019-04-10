// ************************ APP STATE ******************
//CONSTANTS
const TILE_LAYER = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const URL = "http://localhost:3001";

const BOUNDS = new L.LatLngBounds(
  new L.LatLng(3.347563, -76.777372),
  new L.LatLng(3.520973, -76.436782)
);
const VISCOSITY = 1;
const MAX_ZOOM_MAP = 18;
const INITIAL_ZOOM = 12;
const MAP_OPTIONS = {
  zoom: INITIAL_ZOOM,
  center: BOUNDS.getCenter(),
  minZoom: INITIAL_ZOOM,
  maxZoom: MAX_ZOOM_MAP,
  maxBounds: BOUNDS,
  maxBoundsViscosity: VISCOSITY
};
//VARIABLES
let mMap = null;
let categories = {
  visible: [],
  priorities: {}
};
let overlaysObj = {};
let baseLayer = null;
let autoCompleteData = [];
let userLocation = null;
let bufferRange = null;
let paradas = null;
let markerDestino = null;
let rutaParada = null;
// ************************ END APP STATE ******************

// ************************ MAIN ******************
$(document).ready(() => {
  loadMap();
  $("#range").on("change", handleOnRangeChange);
  $("#boton-ubicacion").on("click", handleOnMyLocation);
  $("#boton-destino").on("click", handleOnFindDestino);
  $("#paradas_cercanas").on("click", handleOnFindParadas);
  markerDestino = L.marker([3.430117, -76.516013], {
    draggable: true
  });

  markerDestino.on('dragend', (event) => {
    //alert('drag ended');
    var marker = event.target;
    var location = marker.getLatLng();
    var lat = location.lat;
    var lon = location.lng;
    updateTextInput("text-destino", [lat, lon]);

  });
  markerDestino.addTo(mMap);

});
// ************************ END MAIN ******************

// ************************ COMMAND FUNCTIONS ******************

const loadMap = options => {
  if (mMap) mMap = null;
  mMap = L.map("mapid", MAP_OPTIONS);
  baseLayer = L.tileLayer(TILE_LAYER);

  baseLayer.addTo(mMap);
  // loadMototripFeatures();
};

const loadMototripFeatures = async () => {
  let entities = [
    // "clientes",
    // "conductores",
    // "barrios",
    "vias"
    // "rutas_mio",
    // "rutas_petroncales",
    // "rutas_troncales"
  ];

  let features = await Promise.all(
    entities.map(entity =>
      fetch(`${URL}/${entity}`).then(result => result.json())
    )
  );

  features.forEach(f => new L.GeoJSON(f).addTo(mMap));
  // new L.GeoJSON(data, {
  //   pointToLayer,
  //   onEachFeature: handleOnEachFeature
  // });
  // loadSearchControl();
  // loadGroupedLayers();
};

const loadGroupedLayers = () => {
  overlaysObj.priority = {};
  overlaysObj.visible = L.layerGroup(categories.visible);
  mMap.addLayer(overlaysObj.visible);
  overlaysObj.visible.eachLayer(marker => marker.openPopup());
  //I will comment it, but it wiil help later with some debugging
  loadGroupedLayerControl();
};

//Initialize grouped layers control
const loadGroupedLayerControl = () => {
  let priority = {};
  let visible = overlaysObj.visible;
  for (let i in overlaysObj.priority) {
    for (let j in overlaysObj.priority[i]) {
      priority[j] = overlaysObj.priority[i][j];
    }
  }
  let groupedOverlays = {
    Visible: { "1": visible },
    Prioridades: priority
  };
  let mapabase = {
    "Capa base": baseLayer
  };
  L.control.groupedLayers(mapabase, groupedOverlays).addTo(mMap);
};

const getParadasFromRange = (location, range) => {
  if (!location || !range) return;
  console.log("PARADAS RANGE", { location, range });
  let [latitude, longitude] = location;
  let url = `${URL}/paradas_buffer?latitude=${latitude}&longitude=${longitude}&buffer=${range}`;
  fetch(url)
    .then(res => res.json())
    .then(geojson => {
      console.log('geojson', geojson)
      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      if (mMap.hasLayer(paradas)) {
        mMap.removeLayer(paradas)
      } else {
        paradas = L.geoJSON(geojson, {
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
          }
        })
        paradas.addTo(mMap);
      }
      $("#paradas-text").html("");
      geojson.features.forEach(f => {
        let { nombre, distancia, id } = f.properties;
        var radioBtn = $(`<input type="radio" name="parada-radio" id="${nombre}-radio" value="${id}"/>
        <label for="${nombre}-radio"> <strong>${nombre}</strong> - ${parseFloat(distancia).toFixed(2)} kms</label>`);
        radioBtn.appendTo('#paradas-text');
      });
      $("input[name='parada-radio']").on("change", handleOnChangeRadio);
    });
};

const updateTextInput = (element, value) => {
  if (!element || !value) return;
  document.getElementById(element).innerHTML = value;
};

// ************************ END COMMAND FUNCTIONS ******************

// ************************ EVENT HANDLERS ******************
const getRutaParada = (point, parada) => {
  if (!point || !parada) return;
  console.log('{point, parada}', {point, parada})
  let[ latitude, longitude ] = point;
  let url = `${URL}/ruta_parada?latitude=${latitude}&longitude=${longitude}&parada=${parada}`;
  fetch(url)
    .then(res => res.json())
    .then(geojson => {
      console.log('geojson', geojson)
      if (mMap.hasLayer(rutaParada)) {
        mMap.removeLayer(rutaParada)
        rutaParada = L.geoJSON(geojson)
        rutaParada.addTo(mMap);
        } else {
          rutaParada = L.geoJSON(geojson)
          rutaParada.addTo(mMap);
        }
    });
}

const handleOnChangeRadio = (e) => {
  console.log('e', e.target.value)
  console.log('e', userLocation)
  
  const parada = e.target.value;
  if (parada && userLocation) {
    getRutaParada(userLocation, parada)
  }
}

const handleOnFindDestino = (e) => {
  markerDestino.addTo(mMap);
}

const handleOnMyLocation = () => {
  navigator.geolocation.getCurrentPosition(location => {
    userLocation = [location.coords.latitude, location.coords.longitude];
    let latlng = new L.LatLng(...userLocation);
    let marker = L.marker(latlng).addTo(mMap);
    let text = `Tu ubicación actúal es:\n ${userLocation}`
    updateTextInput("myLocation", text);
    $(".not-visible").removeClass("not-visible")
    $("#boton-ubicacion").addClass("not-visible");
  });
};

const handleOnRangeChange = e => {
  const { target } = e;
  if (!target) return;
  bufferRange = target.value;
  updateTextInput("textInput", bufferRange);
};

const handleOnFindParadas = e => {
  if (userLocation && bufferRange) {
    getParadasFromRange(userLocation, bufferRange);
  }
};

const handleOnEachFeature = (feature, layer) => {
  let { prioridad, visible } = feature.properties;
  if (visible && visible === 1) {
    categories.visible.push(layer);
  } else {
    if (typeof categories.priorities[prioridad] === "undefined") {
      categories.priorities[prioridad] = [];
    }
    categories.priorities[prioridad].push(layer);
  }
};

// ************************ END EVENT HANDLERS ******************

const pointToLayer = (feature, latlng) => {
  let text = getPopupHtmlContent(feature);
  let mIcon, marker, popup;
  let { visible, enlace } = feature.properties;
  let iconOptions = {
    iconSize: [22, 22],
    iconAnchor: [4, 4],
    html: ""
  };
  let popupOptions = {
    closeButton: false,
    className: "custom",
    autoClose: true
  };

  mIcon = L.divIcon(iconOptions);
  marker = L.marker(latlng, {
    icon: mIcon
  });

  if (!isMobileDevice()) {
    marker.on("mouseover", () => {
      for (let data of autoCompleteData) {
        data.marker.closePopup();
      }
      marker.openPopup();
    });
    marker.on("click", () => {
      window.open(enlace, "_self");
    });
  }
  popup = visible
    ? marker.bindPopup(text, { ...popupOptions, autoClose: false })
    : marker.bindPopup(text, popupOptions);
  autoCompleteData.push({
    id: feature.id,
    text: feature.properties.nombre_busqueda,
    marker: marker
  });

  return popup;
};

const isMobileDevice = () =>
  typeof window.orientation !== "undefined" ||
  navigator.userAgent.indexOf("IEMobile") !== -1;

const getPopupHtmlContent = ({ properties: { altura, enlace, nombre } }) =>
  `
    <div class="wave-score">
      <span>${altura} </span>
    </div>
    <div class="wave-link" >
      <a 
      href="${enlace}" >
        ${nombre} 
      </a>
    </div>`;
