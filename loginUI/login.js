document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const ip = document.getElementById('ip').value;

  const mockLoginURL = 'http://localhost:3000/login';
  const lessMockedLoginURL = 'http://localhost:3002/login';


  fetch(lessMockedLoginURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, ip })
  })
    .then(response => response.text())
    .then(data => {
      document.getElementById('message').textContent = data;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('message').textContent = 'Failed to connect to server';
    });
});
