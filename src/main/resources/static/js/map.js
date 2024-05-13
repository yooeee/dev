let map;
let vectorLayer; // 벡터 레이어를 전역 변수로 선언

window.onload = function () {
  init();
  setEvent();
};

function init() {
  
  map = new ol.Map({
    target: "map",
    controls: [],
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([127.5, 36]), // 대한민국 중심 좌표
      // zoom: 7, // 대한민국 전체가 잘 보이는 줌 레벨
      // minZoom: 6.5
    })
  });

  document.getElementById("address-info").addEventListener("click", function() {
    updateLocation(map);
  });
  updateLocation(map);
}

function setEvent() {

}

function updateLocation(map) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const coords = [position.coords.longitude, position.coords.latitude];
      const olCoords = ol.proj.fromLonLat(coords);
      map.getView().animate({ center: olCoords, zoom: 14 });

      if (vectorLayer) {
        map.removeLayer(vectorLayer);
      }

      const vectorSource = new ol.source.Vector({
        features: [
          new ol.Feature(new ol.geom.Point(olCoords)),
          new ol.Feature(new ol.geom.Circle(olCoords, 2000))
        ]
      });

      vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({ color: "blue" }),
            stroke: new ol.style.Stroke({ color: "white", width: 2 }),
          }),
          fill: new ol.style.Fill({
            color: "rgba(0, 0, 255, 0.1)",
          }),
          stroke: new ol.style.Stroke({
            color: "blue",
            width: 2,
          }),
        }),
      });

      map.addLayer(vectorLayer);

      
      fetchAddress(coords);
     
    }, function (error) {
      console.error("Geolocation error: ", error);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function fetchAddress(coords) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[1]}&lon=${coords[0]}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById("address-info").innerHTML = `현재 위치: ${data.display_name}`;
    })
    .catch(error => console.error("역지오코딩 에러:", error));
}
