import * as Api from '/api.js';

const passwordInput = document.getElementById('passwordInput');
const submitButton = document.getElementById('submitButton');

async function userSignOut(e) {
  e.preventDefault();
  if (!confirm('정말 회원 탈퇴하시겠습니까?')) return;

  const password = passwordInput.value;
  const data = { password };
      try {
        const res = await Api.del('', data);

        alert(`${res.message}`);
        console.log('탈퇴된 유저: ', res.result);

        
        sessionStorage.removeItem('token');
        window.location.href = '/';
      } catch (err) {
        alert(err.message);
      }
    }
  submitButton.addEventListener('click', userSignOut);

