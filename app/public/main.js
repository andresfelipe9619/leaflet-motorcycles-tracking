// ************************ APP STATE ******************
//CONSTANTS
const TILE_LAYER =
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";
const TOKEN =
  "pk.eyJ1IjoiYW5kcmVzOTYxOSIsImEiOiJjanExdTFodjMwYXQyNDNuMmVvazV6eHBlIn0.kOpHKEx5EBGD8YIXmKRQWA";
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
// ************************ END APP STATE ******************

// ************************ MAIN ******************
$(document).ready(() => {
  loadMap();
  $("#botonubicacion").on("click", () => {
    navigator.geolocation.getCurrentPosition(location => {
      let latlng = new L.LatLng(
        location.coords.latitude,
        location.coords.longitude
      );
      let marker = L.marker(latlng).addTo(mMap);
      $("#myLocation").val(latlng)
    });
  });
  $("#range").on("change", e => {
    console.log("targe", e.target.value)
    updateTextInput(e.target.value)
  })
});
// ************************ END MAIN ******************

// ************************ COMMAND FUNCTIONS ******************
const updateTextInput = (val) => {
  document.getElementById('textInput').value=val; 
}
const loadMap = options => {
  if (mMap) mMap = null;
  mMap = L.map("mapid", MAP_OPTIONS);
  baseLayer = L.tileLayer(TILE_LAYER, {
    maxZoom: 12,
    id: "mapbox.streets",
    accessToken: TOKEN
  });

  baseLayer.addTo(mMap);
  loadMototripFeatures();
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

  features.forEach(f => new L.GeoJSON(features).addTo(mMap));
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

// ************************ END COMMAND FUNCTIONS ******************

// ************************ EVENT HANDLERS ******************

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
