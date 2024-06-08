document.cookie = "exampleCookie=cookieValue; path=/; Secure; SameSite=None";

function showLoadingBar() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingOverlay.style.zIndex = '9999';
    loadingOverlay.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"><img src="/img/loading.gif" alt="Loading..."></div>';
    document.body.appendChild(loadingOverlay);
}

function hideLoadingBar() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initInfoIndex();
    setInitEvent();
});


function initInfoIndex() {
    showLoadingBar();

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
            hideLoadingBar();
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
                    // review-item 클래스를 추가합니다.
                    const reviewItem = document.createElement('div');
                    reviewItem.classList.add('review-item');
                    reviewItem.appendChild(clone);
                    // reviewList 컨테이너에 review-item을 추가합니다.
                    reviewListContainer.appendChild(reviewItem);
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

                let blogReviewList = result.result.blogReviewList;

                const blogListContainer = document.getElementById('blogList');
                blogListContainer.innerHTML = '';

                blogReviewList.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.classList.add('blog-review-item');

                    const titleElement = document.createElement('strong');
                    titleElement.classList.add('tit_review');
                    titleElement.textContent = review.title;
                    reviewElement.appendChild(titleElement);

                    const contentElement = document.createElement('p');
                    contentElement.classList.add('txt_review');
                    contentElement.textContent = review.content;
                    reviewElement.appendChild(contentElement);

                    const authorElement = document.createElement('span');
                    authorElement.classList.add('loss_word');
                    authorElement.textContent = '작성자: ' + review.author;
                    reviewElement.appendChild(authorElement);

                    const dateElement = document.createElement('span');
                    dateElement.classList.add('review_date');
                    dateElement.textContent = review.date;
                    reviewElement.appendChild(dateElement);

                    const linkElement = document.createElement('a');
                    linkElement.classList.add('link_review');
                    linkElement.href = review.link;
                    linkElement.target = '_blank';
                    linkElement.textContent = '블로그에서 보기';
                    reviewElement.appendChild(linkElement);

                    const photoContainer = document.createElement('div');
                    photoContainer.classList.add('photo_container');
                    review.photos.split(',').forEach(photoUrl => {
                        const imgElement = document.createElement('img');
                        imgElement.src = photoUrl;
                        imgElement.classList.add('img_thumb');
                        photoContainer.appendChild(imgElement);
                    });
                    reviewElement.appendChild(photoContainer);

                    blogListContainer.appendChild(reviewElement);
                });

            } else {
                console.log("fail search");
            }
        })
        .catch(error => console.error('There was a problem with your fetch operation:', error));

}


function setInitEvent() {
    // 여기에 초기화 이벤트를 추가하십시오.
}
