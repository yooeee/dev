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
            let kakaoReviewList = result.result.kakaoReviewList || [];
            let menuList = result.result.menuList || [];
            let photoHrefList = result.result.photoHrefList || [];
            let numberList = result.result.numberList || [];
            let timeList = result.result.timeList || [];

            const reviewListContainer = document.getElementById('reviewList');
            reviewListContainer.innerHTML = '';

            if (kakaoReviewList.length === 0) {
                reviewListContainer.innerHTML = '<li>조회된 결과가 없습니다.</li>';
            } else {
                kakaoReviewList.forEach(review => {
                    const reviewItem = document.createElement('li');
                    reviewItem.classList.add('review-item');

                    const innerGrade = document.createElement('div');
                    innerGrade.classList.add('inner_grade');

                    const infoUser = document.createElement('div');
                    infoUser.classList.add('info_user');

                    const userName = document.createElement('span');
                    userName.classList.add('name_user');
                    userName.textContent = review.username;

                    const userReview = document.createElement('p');
                    userReview.classList.add('txt_comment');
                    userReview.textContent = review.review;

                    const reviewDate = document.createElement('span');
                    reviewDate.classList.add('time_write');
                    reviewDate.textContent = review.date;

                    const reviewRating = document.createElement('span');
                    reviewRating.classList.add('inner_star');
                    reviewRating.setAttribute('style', review.rating);

                    innerGrade.appendChild(infoUser);
                    infoUser.appendChild(userName);
                    innerGrade.appendChild(userReview);
                    innerGrade.appendChild(reviewDate);
                    innerGrade.appendChild(reviewRating);

                    reviewItem.appendChild(innerGrade);
                    reviewListContainer.appendChild(reviewItem);
                });
            }

            document.getElementById('number').innerHTML = '전화번호 : ' + (numberList.length > 0 ? numberList : '조회된 결과가 없습니다.');

            // 메뉴 리스트 처리
            const menuListContainer = document.getElementById('menuList');
            menuListContainer.innerHTML = '';

            if (menuList.length === 0) {
                menuListContainer.innerHTML = '<li>조회된 결과가 없습니다.</li>';
            } else {
                menuList.forEach(item => {
                    const menuItem = document.createElement('li');

                    const infoMenu = document.createElement('div');
                    infoMenu.classList.add('info_menu');

                    const menuName = document.createElement('span');
                    menuName.classList.add('name_menu');
                    menuName.textContent = item.name;

                    const menuPrice = document.createElement('em');
                    menuPrice.classList.add('price_menu');
                    menuPrice.textContent = item.price;

                    infoMenu.appendChild(menuName);
                    infoMenu.appendChild(menuPrice);
                    menuItem.appendChild(infoMenu);
                    menuListContainer.appendChild(menuItem);
                });
            }

            document.getElementById('timeList').innerHTML = '영업시간 : ' + (timeList ? timeList : '조회된 결과가 없습니다.');


            let blogReviewList = result.result.blogReviewList || [];

            const blogListContainer = document.getElementById('blogList');
            blogListContainer.innerHTML = '';

            if (blogReviewList.length === 0) {
                blogListContainer.innerHTML = '<div>조회된 결과가 없습니다.</div>';
            } else {
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
            }

        } else {
            console.log("fail search");
        }
    })
    .catch(error => console.error('There was a problem with your fetch operation:', error));
}

function setInitEvent() {
    // 여기에 초기화 이벤트를 추가하십시오.
}
