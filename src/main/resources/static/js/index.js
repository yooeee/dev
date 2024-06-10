let currentPage = 1;
const itemsPerPage = 10;
let cluster = new H_Cluster(map, { layerName: 'cluster' });
// 팝업 요소 가져오기
let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');
// 현재 아이템을 저장할 변수
let currentItem = null;

let currentPopup = null; // 현재 팝업을 저장할 변수

// 팝업 클릭 이벤트
content.onclick = function () {
    if (currentItem) {
        fetchAdditionalInfo(currentItem);
    }
}

// 팝업 초기화
let overlay = new ol.Overlay({
    element: container,
    autoPan: true,
});

map.addOverlay(overlay);

// 팝업 닫기 이벤트
closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

document.addEventListener('DOMContentLoaded', function () {
    initIndex();
    setInitEvent();
});

function initIndex() {
    /**
     * TODO
     * 1. 위치권한 여부 파악 
     * 1-1 권한 승인 : 내 위치 반경 1미터 조건 검색적용
     * 1-2 권한 거부 : 한반도 전체 영역 표시, 
     */
}

function setInitEvent() {
    // 페이징버튼 시작
    document.querySelector('.prev-button').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            getSearchList(currentPage);
        }
    });

    document.querySelector('.next-button').addEventListener('click', () => {
        currentPage++;
        getSearchList(currentPage);
    });
    // 페이징버튼 종료

    // 조건버튼 이벤트 시작
    document.getElementById('locationDropdown').querySelectorAll('select').forEach(select => { });

    document.getElementById('categoryDropdown').querySelectorAll('input[type="checkbox"]').forEach(checkbox => { });
    // 조건버튼 이벤트 종료

    // 검색버튼 이벤트
    document.getElementById('searchBtn').addEventListener('click', function () {
        currentPage = 1;
        getSearchList(1);
    });

    // 리셋버튼 이벤트
    document.getElementById('resetBtn').addEventListener('click', function () {
        // type1의 선택 값을 "all"로 설정
        document.getElementById('type1').value = "all";

        // type2의 선택 값을 초기화
        const type2 = document.getElementById('type2');
        type2.innerHTML = '<option value="all" disabled selected>시/군/구</option>';

        // 필요한 경우 다른 필터 및 검색어 초기화
        document.getElementById('keyword').value = '';
        document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    });

    // type1 이벤트
    document.getElementById('type1').addEventListener('change', function (e) {
        let selectedValue = e.target.value;
        let type2 = document.getElementById('type2');

        if (selectedValue == "all") {
            type2.innerHTML = '<option value="all" disabled selected>시/군/구</option>';
        } else if (selectedValue == "my") {
            type2.innerHTML = '<option value="" disabled selected>내 반경</option>';

            let distances = [500, 1000, 1500, 2000];
            distances.forEach(distance => {
                let option = document.createElement('option');
                option.value = distance;
                option.textContent = `${distance}M`;
                type2.appendChild(option);
            });
        } else {
            fetch(`/api/bjcd/sgg?bjcd=${selectedValue}`)
                .then(response => response.json())
                .then(data => {
                    type2.innerHTML = '<option value="all" disabled selected>시/군/구</option>';

                    // 가져온 데이터를 반복하여 option 요소를 생성하고 추가
                    data.result.forEach(item => {
                        let option = document.createElement('option');
                        option.value = item.bjcd;
                        option.textContent = item.name;
                        type2.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    // 에러 처리를 여기에 작성합니다.
                });
        }
    });
}

function getSearchList(page) {
    const keyword = document.getElementById('keyword').value;
    const type1 = document.getElementById('type1').value;
    const type2 = document.getElementById('type2').value;
    if (keyword.length === 0 && type1 != 'my') {
        alert("검색어를 입력해주세요.");
        return;
    }
    const data = {
        page: page,
        maxIndex: 10,
        keyword: keyword,
        type1: type1,
        type2: type2,
    };

    if (type1 == "my") {
        data.lon = myCoords[0] + '';
        data.lat = myCoords[1] + '';
    }

    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const categorys = Array.from(checkboxes).map(checkbox => checkbox.value);
    data.category = categorys;

    fetch('/api/store?' + new URLSearchParams(data).toString(), {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            if (result.status == 'success') {
                // 지도에 추가된 모든 오버레이를 제거
                map.getOverlays().clear();

                // 반경조회
                if (type1 == 'my') {
                    // type2를 숫자로 변환
                    let type2Number = parseInt(type2, 10);
                    updateLocation(map, type2Number);
                } else {
                    cluster.createAdmbdClusterLayer(result.result, result.sdResult, result.sggResult);
                }

                let totalCount = document.querySelector('.total-count');
                let searchItemsContainer = document.querySelector('.search-items-container');
                let template = document.getElementById('searchItemTpl');

                // 검색 결과 초기화
                searchItemsContainer.innerHTML = '';
                totalCount.textContent = result.resultCnt;

                // 검색 결과 항목 추가
                result.result.forEach(item => {
                    let clone = template.content.cloneNode(true);
                    let searchItem = clone.querySelector('.search-item');

                    // 검색 항목에 데이터 설정
                    if (type1 != 'my') {
                        searchItem.querySelector('.restaurant-name').textContent = item.name;
                    } else if (type1 == 'my') {
                        searchItem.querySelector('.restaurant-name').textContent = item.name + '(' + item.distance + ' M)';
                    }

                    searchItem.querySelector('.restaurant-address').textContent = item.doro;

                    // 클릭 이벤트 추가
                    searchItem.addEventListener('click', () => {
                        // 지도 이동 함수 호출
                        moveToMapCoordinates(item);
                    });

                    searchItemsContainer.appendChild(clone);
                });

                // 페이지 번호 업데이트
                updatePagination(result.resultCnt);

                // 지도에 결과 표시
                displayMarker(result.result);
            } else {
                console.log("fail search");
            }
        })
        .catch(error => console.error('There was a problem with your fetch operation:', error));
}

// 지도 이동 함수
function moveToMapCoordinates(item) {
    // OpenLayers 예시
    let view = map.getView();
    view.setCenter([parseFloat(item.lon), parseFloat(item.lat)]);
    view.setZoom(18);
      // 마커 아이템을 배열로 전달하여 팝업 띄우기
    addPopupToMap([item], [parseFloat(item.lon), parseFloat(item.lat)]);
}

function displayMarker(results) {
    if (resultLayer) {
        map.removeLayer(resultLayer);
    }

    const coordinatesMap = new Map();

    results.forEach(item => {
        const coordinatesKey = `${item.lon},${item.lat}`;
        if (!coordinatesMap.has(coordinatesKey)) {
            coordinatesMap.set(coordinatesKey, []);
        }
        coordinatesMap.get(coordinatesKey).push(item);
    });

    const features = [];
    coordinatesMap.forEach((items, coordinatesKey) => {
        const [lon, lat] = coordinatesKey.split(',').map(parseFloat);
        const coordinates3857 = [lon, lat]; // EPSG:3857 좌표로 가정
        const feature = new ol.Feature(new ol.geom.Point(coordinates3857));
        feature.setProperties({ items }); // 마커와 관련된 데이터 저장
        features.push(feature);
    });

    const vectorSource = new ol.source.Vector({ features: features });

    resultLayer = new ol.layer.Vector({
        name: 'resultLayer',
        source: vectorSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: '/img/marker.png',
                scale: 0.05
            })
        })
    });

    map.addLayer(resultLayer);

    if (document.getElementById('type1').value != 'my') {
        if (document.getElementById('type1').value == 'all') {
            let view = map.getView();
            view.setCenter(ol.proj.fromLonLat([127.5, 36]));  // olCoords는 변경하고자 하는 중심 좌표
            view.setZoom(7);
        } else {
            const extent = vectorSource.getExtent();
            map.getView().fit(extent, {
                size: map.getSize(),
                padding: [200, 200, 200, 200]
            });
        }
    }
}
function addPopupToMap(items, coordinates) {
    // 기존 팝업이 있으면 제거
    if (currentPopup) {
        map.removeOverlay(currentPopup);
    }

    let newContainer = document.createElement('div');
    newContainer.className = 'ol-popup';

    let newContent = document.createElement('div');
    newContent.className = 'popup-container';

    items.forEach(item => {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'popup-item';
        itemDiv.innerHTML = `
            <div class="popup-title">${item.name}</div>
            <div class="popup-address">${item.doro}</div>
        `;
        itemDiv.addEventListener('click', () => {
            fetchAdditionalInfo(item);
        });
        newContent.appendChild(itemDiv);
    });

    newContainer.appendChild(newContent);

    let newOverlay = new ol.Overlay({
        element: newContainer,
        autoPan: true,
    });

    map.addOverlay(newOverlay);
    newOverlay.setPosition(coordinates);

    currentPopup = newOverlay; // 현재 팝업 업데이트

    // 팝업 닫기 이벤트 추가
    newContainer.addEventListener('click', () => {
        map.removeOverlay(newOverlay);
        currentPopup = null; // 팝업 제거 후 변수 초기화
    });
}

function updatePagination(totalCount) {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    const maxVisiblePages = 5;
    paginationContainer.innerHTML = '';

    // 이전 버튼
    const prevButton = document.createElement('button');
    prevButton.classList.add('prev-button');
    prevButton.textContent = '◀';
    prevButton.disabled = (currentPage === 1);
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            getSearchList(currentPage);
        }
    });
    paginationContainer.appendChild(prevButton);

    // 페이지 번호 버튼
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('page-number');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            getSearchList(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }

    // 다음 버튼
    const nextButton = document.createElement('button');
    nextButton.classList.add('next-button');
    nextButton.textContent = '▶';
    nextButton.disabled = (currentPage === totalPages);
    nextButton.addEventListener('click', () => {
        currentPage++;
        getSearchList(currentPage);
    });
    paginationContainer.appendChild(nextButton);
}

function toggleDropdown(id, button) {
    // 모든 드롭다운 메뉴를 가져옴
    const allDropdowns = document.querySelectorAll('.filter-dropdown');
    // 현재 조작하려는 드롭다운을 제외한 나머지 드롭다운을 닫음
    allDropdowns.forEach(dropdown => {
        if (dropdown.id !== id) {
            dropdown.style.display = 'none';
            // 관련된 버튼의 활성 상태를 제거
            const relatedButton = document.querySelector(`.button-active[onclick*="${dropdown.id}"]`);
            if (relatedButton) {
                relatedButton.classList.remove('button-active');
            }
        }
    });

    const dropdown = document.getElementById(id);
    const isDisplayed = dropdown.style.display === 'block';
    dropdown.style.display = isDisplayed ? 'none' : 'block';

    // 드롭다운 상태 변경 후 확인 작업 실행
    if (!isDisplayed) {
        // 드롭다운이 열릴 때 상태 확인
        checkAndToggleActiveState(id, button);
    } else {
        // 드롭다운이 닫힐 때, 언제나 비활성 상태로 설정
        button.classList.remove('button-active');
    }
}

// 추가 정보 요청 함수
function fetchAdditionalInfo(item) {
    const data = {
        seq: item.seq,
        category: item.category,
        name: item.name,
        doro: item.doro,
        jibeon: item.jibeon
    }

    let popupX = document.body.offsetWidth / 2 - 1110 / 2;
    popupX += window.screenLeft;
    let popupY = window.screen.height / 2 - 762 / 2;
    return window.open(
        '/index/info?' + new URLSearchParams(data).toString(),
        '_blank',
        'toolbar=no, menubar=no, scrollbars=yes, resizable=no, width=1350, height=762, left=' + popupX + ', top=' + popupY
    );
}
