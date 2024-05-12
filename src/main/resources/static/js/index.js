// function toggleDropdown(id, button) {
//   // 모든 드롭다운 메뉴를 가져옴
//   const allDropdowns = document.querySelectorAll('.filter-dropdown');
//   // 현재 조작하려는 드롭다운을 제외한 나머지 드롭다운을 닫음
//   allDropdowns.forEach(dropdown => {
//       if (dropdown.id !== id) {
//           dropdown.style.display = 'none';
//           // 관련된 버튼의 활성 상태를 제거
//           const relatedButton = document.querySelector(`.button-active[onclick*="${dropdown.id}"]`);
//           if (relatedButton) {
//               relatedButton.classList.remove('button-active');
//           }
//       }
//   });

//   const dropdown = document.getElementById(id);
//   const isDisplayed = dropdown.style.display === 'block';
//   dropdown.style.display = isDisplayed ? 'none' : 'block';

//   // 드롭다운 상태 변경 후 확인 작업 실행
//   if (!isDisplayed) {
//       // 드롭다운이 열릴 때 상태 확인
//       checkAndToggleActiveState(id, button);
//   } else {
//       // 드롭다운이 닫힐 때, 언제나 비활성 상태로 설정
//       button.classList.remove('button-active');
//   }
// }

// // 이벤트 리스너 추가 예시
// document.getElementById('locationDropdown').querySelectorAll('select').forEach(select => {
//   select.addEventListener('change', function() {
//       checkAndToggleActiveState('locationDropdown', document.querySelector('.button-active[onclick*="locationDropdown"]'));
//   });
// });

// document.getElementById('categoryDropdown').querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
//   checkbox.addEventListener('change', function() {
//       checkAndToggleActiveState('categoryDropdown', document.querySelector('.button-active[onclick*="categoryDropdown"]'));
//   });
// });
