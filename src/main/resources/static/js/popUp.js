document.cookie = "exampleCookie=cookieValue; path=/; Secure; SameSite=None";

document.addEventListener('DOMContentLoaded', function () {
    initInfoIndex();
    setInitEvent();
});


function initInfoIndex() {

    const data = {
        seq: SEQ,
        category: CATEGORY,
        name: NAME,
        doro: DORO,
        jibeon: JIBEON,
    }

    fetch('/api/store/info?' + new URLSearchParams(data).toString(), {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                alert("크롤링 실패");
                throw new Error('Network response was not ok');

            }
            return response.json();
        })
        .then(result => {
            if (result.status == 'success') {

                let kakaoReviewList = result.result.kakaoReviewList;
                let menuList = result.result.menuList;
                let photoHrefList = result.result.photoHrefList;
                let numberList = result.result.numberList;
                let timeList = result.result.timeList;

                // reviewTpl 템플릿을 가져옵니다.
                const reviewTpl = document.getElementById('reviewTpl');
                // reviewList 컨테이너를 가져옵니다.
                const reviewListContainer = document.getElementById('reviewList');

                // kakaoReviewList의 각 항목에 대해 반복합니다.
                kakaoReviewList.forEach(review => {
                    // 템플릿의 내용을 복제합니다.
                    const clone = document.importNode(reviewTpl.content, true);
                    // 복제된 템플릿 내부의 p 요소를 찾습니다.
                    const pElement = clone.querySelector('p');
                    // p 요소에 리뷰 내용을 추가합니다.
                    pElement.textContent = review;
                    // 복제된 템플릿을 reviewList 컨테이너에 추가합니다.
                    reviewListContainer.appendChild(clone);
                });

                document.getElementById('number').innerHTML = '전화번호 : ' + numberList;

                const menuListContainer = document.getElementById('menuList');
                menuListContainer.innerHTML = ''; // 기존 내용을 지움

                menuList.forEach(item => {
                    const p = document.createElement('p');
                    p.innerHTML = item.replace(/\n/g, '<br>');
                    menuListContainer.appendChild(p);
                });


                timeList = timeList.split('\n').filter(item => item.trim() !== '수정 시간' && item.trim() !== '이동하기' && item.trim() !== '수정 제안').join(' ');
                document.getElementById('timeList').innerHTML = '영업시간 : ' + timeList;
            } else {
                console.log("fail search");
            }
        })
        .catch(error => console.error('There was a problem with your fetch operation:', error));

}


function setInitEvent() {

}