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
let layersBasedOnZoom = {};
let baseLayer = null;
let autoCompleteData = [];
let userLocation = null;
let bufferRange = null;
// ************************ END APP STATE ******************

// ************************ MAIN ******************
$(document).ready(() => {
  loadMap();
  $("#range").on("change", handleOnRangeChange);
  $("#botonubicacion").on("click", handleOnMyLocation);
  $("#paradas_cercanas").on("click", handleOnFindParadas);
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
    "paradas"
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
      geojson.features.forEach(f => new L.GeoJSON(f).addTo(mMap));
    });
};

const updateTextInput = (element, value) => {
  if (!element || !value) return;
  document.getElementById(element).innerHTML = value;
};

// ************************ END COMMAND FUNCTIONS ******************

// ************************ EVENT HANDLERS ******************
const handleOnMyLocation = () => {
  navigator.geolocation.getCurrentPosition(location => {
    userLocation = [location.coords.latitude, location.coords.longitude];
    let latlng = new L.LatLng(...userLocation);
    let marker = L.marker(latlng).addTo(mMap);
    updateTextInput("myLocation", userLocation);
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
