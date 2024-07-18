
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
  event.preventDefault();

  const username = (document.getElementById('username') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const ip = (document.getElementById('ip') as HTMLInputElement).value;

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
      const messageContent = document.getElementById('message')
      if (messageContent) {
        messageContent.textContent = data;
      } else {
        console.error('Error: Response not received');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      const messageElement = document.getElementById('message');
      if (messageElement) {
        messageElement.textContent = 'Failed to connect to server';
      } else {
        console.error('Element with ID "message" not found.');
      }
    });
});
