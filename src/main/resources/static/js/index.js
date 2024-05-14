window.onload = function () {
    init();
    setEvent();
};

function init() {
    /**
     * TODO
     * 1. 위치권한 여부 파악 
     * 1-1 권한 승인 : 내 위치 반경 1미터 조건 검색적용
     * 1-2 권한 거부 : 한반도 전체 영역 표시, 
     */
}

function setEvent() {


    // 조건버튼 이벤트 시작
    document.getElementById('locationDropdown').querySelectorAll('select').forEach(select => {
        select.addEventListener('change', function () {
            checkAndToggleActiveState('locationDropdown', document.querySelector('.button-active[onclick*="locationDropdown"]'));
        });
    });

    document.getElementById('categoryDropdown').querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            checkAndToggleActiveState('categoryDropdown', document.querySelector('.button-active[onclick*="categoryDropdown"]'));
        });
    });
    // 조건버튼 이벤트 종료


    // 검색버튼 이벤트
    document.getElementById('searchBtn').addEventListener('change', function () {
        getSearchList(1);
    });

    // 리셋버튼 이벤트
    document.getElementById('resetBtn').addEventListener('change', function () {
        // TODO 조건 리셋
    });

}

function getSearchList(page) {
    const data = {
        page: page,
        maxIndex: 10,
        keyword: document.getElementById('keyword').value,
        type1: document.getElementById('type1').value,
        type2: document.getElementById('type2').value,
    };


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
                //TODO 1. PAGE처리, 2. 지도기능 적용 (조건별로)
            }
            else {
                console.log("fail search");
            }
        })
        .catch(error => console.error('There was a problem with your fetch operation:', error));

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


