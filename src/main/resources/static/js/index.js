let currentPage = 1;
const itemsPerPage = 10;
let cluster = new H_Cluster(map, { layerName: 'cluster' });

// 팝업 요소 가져오기
let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');
// 현재 아이템을 저장할 변수
let currentItem = null;

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
    autoPanAnimation: {
        duration: 250,
    },
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
    document.getElementById('locationDropdown').querySelectorAll('select').forEach(select => {

    });

    document.getElementById('categoryDropdown').querySelectorAll('input[type="checkbox"]').forEach(checkbox => {

    });
    // 조건버튼 이벤트 종료


    // 검색버튼 이벤트
    document.getElementById('searchBtn').addEventListener('click', function () {
        currentPage = 1;
        getSearchList(1);
    });

    // 리셋버튼 이벤트
    document.getElementById('resetBtn').addEventListener('click', function () {
        // TODO 조건 리셋
    });

    // type1 이벤트
    document.getElementById('type1').addEventListener('change', function(e) {
        let selectedValue = e.target.value;
        let type2 = document.getElementById('type2');

      if(selectedValue == "all"){
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
        }  else {
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
    closer.click();

    const keyword = document.getElementById('keyword').value;
    const type1 = document.getElementById('type1').value;
    const type2 = document.getElementById('type2').value;
    if(keyword.length === 0){
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
    

    if(type1 == "my"){
        data.lon = myCoords[0] + '';
        data.lat = myCoords[1] + '';
    }


    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const categorys = Array.from(checkboxes).map(checkbox => checkbox.value);
    data.category = categorys;

    fetch('/api/store?' +  new URLSearchParams(data).toString(), {
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
                    searchItem.querySelector('.restaurant-name').textContent = item.name;
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
                displayResultsOnMap(result.result);
    
                cluster.createAdmbdClusterLayer(result.result, result.sdResult, result.sggResult);
            }
            else {
                console.log("fail search");
            }
        })
        .catch(error => console.error('There was a problem with your fetch operation:', error));

}

// 지도 이동 함수
function moveToMapCoordinates(item) {

    currentItem = item;
    // 팝업 내용 설정
    content.innerHTML = `<strong>${item.name}</strong>`;
    // 팝업 위치 설정
    overlay.setPosition( [parseFloat(item.lon), parseFloat(item.lat)+6.5]);
    
    // OpenLayers 예시
    let view = map.getView();
    view.setCenter( [parseFloat(item.lon), parseFloat(item.lat)]);
    view.setZoom(18);

    
}

function displayResultsOnMap(results) {
    if (resultLayer) {
        map.removeLayer(resultLayer);
    }

    const features = results.map(item => {
        const coordinates3857 = [parseFloat(item.lon), parseFloat(item.lat)]; // EPSG:3857 좌표
        return new ol.Feature(new ol.geom.Point(coordinates3857));
    });

    const vectorSource = new ol.source.Vector({
        features: features
    });

    resultLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1], // 이미지의 앵커 위치
                src: '/img/marker.png', // 마커 이미지 경로
                scale: 0.05 // 이미지 크기 조정 (필요에 따라 조정 가능)
            }),
        }),
    });


    map.addLayer(resultLayer);

    // 첫 번째 검색 결과의 좌표로 지도 이동
    // if (results.length > 0) {
    //     const firstItem = results[0];
    //     const firstCoordinates3857 = [parseFloat(firstItem.lon), parseFloat(firstItem.lat)]; // EPSG:3857 좌표

    //     // 디버그용 로그
    //     console.log("First Coordinates (EPSG:3857):", firstCoordinates3857);

    //     map.getView().setCenter(firstCoordinates3857);
    //     map.getView().setZoom(9); // 원하는 줌 레벨로 설정
    // }
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
        name : item.name,
        doro : item.doro
    }

    fetch('/api/detail?' +  new URLSearchParams(data).toString(), {
        method: 'GET',
    })
        .then(data => {
            console.log('Additional Info:', data);
            // 추가 정보를 처리하는 코드를 여기에 추가합니다
        })
        .catch(error => console.error('There was a problem with your fetch operation:', error));
}


