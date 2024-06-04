let map;
const vworld_map = 'http://api.vworld.kr/req/wmts/1.0.0/' + 'F9DAD4D2-2AEA-343D-A6AA-CD5521D300EF' + '/Base/{z}/{y}/{x}.png';

const baseMap = new ol.source.XYZ({
  url: vworld_map,
  crossOrigin: 'anonymous',
  transition: 0,
});
map = new ol.Map({
  target: "map",
  controls: [],
  layers: [
    new ol.layer.Tile({
      source: baseMap,
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([127.5, 36]), // 대한민국 중심 좌표
    zoom: 7, // 대한민국 전체가 잘 보이는 줌 레벨
  })
});

let vectorLayer; // 벡터 레이어를 전역 변수로 선언
let myCoords = null; // 현재 좌표
let resultLayer = null; // 검색결과 레이어


window.onload = function () {
  initMap();
  setMapEvent();
};

function initMap() {
 

    document.getElementById("address-info").addEventListener("click", function() {
      checkGeolocationPermissionAndUpdate();
    });
    checkGeolocationPermissionAndUpdate();

 
}

function setMapEvent() {

  // 지도 클릭 이벤트 설정
  map.on('singleclick', function (e) {
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        // 해당 피처의 데이터를 사용하여 추가 정보 가져오기
        if (layer === resultLayer) {
            const item = feature.getProperties();
            fetchAdditionalInfo(item);
        }
    });
});



}

function checkGeolocationPermissionAndUpdate() {
  navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
    if (result.state === 'granted') {
      console.log('위치 권한이 허락되었습니다.');
      updateLocation(map, 1500);
        let selectElement = document.getElementById('type1');
        let selectElement2 = document.getElementById('type2');
        let options = selectElement.options;
        let options2 = selectElement2.options;

        for (var i = 0; i < options.length; i++) {
          if (options[i].value === 'my') {
            selectElement.selectedIndex = i;
            break;
          }
        }

        for (var i = 0; i < options2.length; i++) {
          if (options[i].value === '1500') {
            selectElement.selectedIndex = i;
            break;
          }
        }
        
        // 1초(1000밀리초) 후에 getSearchList(1) 함수 호출
setTimeout(function() {
  getSearchList(1);
}, 500);

    } else if (result.state === 'prompt') {
      console.log('위치 권한 요청 중입니다.');
      // 위치 권한을 요청하여 기본 브라우저 알림이 표시되도록 합니다.
      navigator.geolocation.getCurrentPosition(function (position) {
        updateLocation(map, 1500);
        let selectElement = document.getElementById('type1');
        let selectElement2 = document.getElementById('type2');
        let options = selectElement.options;
        let options2 = selectElement2.options;

        for (var i = 0; i < options.length; i++) {
          if (options[i].value === 'my') {
            selectElement.selectedIndex = i;
            break;
          }
        }

        for (var i = 0; i < options2.length; i++) {
          if (options[i].value === '1500') {
            selectElement.selectedIndex = i;
            break;
          }
        }
        
        getSearchList(1);
      });
    } else if (result.state === 'denied') {
      console.log('위치 권한 요청 중입니다.');
      // 위치 권한을 요청하여 기본 브라우저 알림이 표시되도록 합니다.
      navigator.geolocation.getCurrentPosition(function (position) {
        updateLocation(map, 1500);
      }, function (error) {
        console.error("Geolocation error: ", error);
      });
    }
    result.onchange = function () {
      console.log('위치 권한 상태가 변경되었습니다.');
    }
  });
}


function updateLocation(map, radius) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      myCoords = [position.coords.longitude, position.coords.latitude];
      const olCoords = ol.proj.fromLonLat(myCoords);
      let view = map.getView();
      view.setCenter(olCoords);  // olCoords는 변경하고자 하는 중심 좌표
      view.setZoom(14);

      if (vectorLayer) {
        map.removeLayer(vectorLayer);
      }

      const vectorSource = new ol.source.Vector({
        features: [
          new ol.Feature(new ol.geom.Point(olCoords)),
          new ol.Feature(new ol.geom.Circle(olCoords, radius))
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

      console.log(myCoords);
      fetchAddress(myCoords);
     
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

function removeLayer(name) {
  map.getAllLayers().forEach(layer => {
      if (layer && layer.get('name') == name) {
          map.removeLayer(layer);
      }
  });
}
