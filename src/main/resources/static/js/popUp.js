document.addEventListener('DOMContentLoaded', function () {
    initInfoIndex();
    setInitEvent();
});


function initInfoIndex() {

    const data = {
        seq : SEQ,
        category : CATEGORY,
        name : NAME,
        doro : DORO,
        jibeon : JIBEON,
    }

    fetch('/api/store/info?' + new URLSearchParams(data).toString(), {
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
                console.log("무사히 성공");
                
            } else {
                console.log("fail search");
            }
        })
        .catch(error => console.error('There was a problem with your fetch operation:', error));

}


function setInitEvent() {

}