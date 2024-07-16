// document.getElementById('loginForm').addEventListener('submit', function (event) {
//   event.preventDefault();
var _a;
//   const username = document.getElementById('username').value;
//   const password = document.getElementById('password').value;
//   const ip = document.getElementById('ip').value;
//   const mockLoginURL = 'http://localhost:3000/login';
//   const lessMockedLoginURL = 'http://localhost:3002/login';
(_a = document.getElementById('loginForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var ip = document.getElementById('ip').value;
    var mockLoginURL = 'http://localhost:3000/login';
    var lessMockedLoginURL = 'http://localhost:3002/login';
    fetch(lessMockedLoginURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password, ip: ip })
    })
        .then(function (response) { return response.text(); })
        .then(function (data) {
        var messageContent = document.getElementById('message');
        if (messageContent) {
            messageContent.textContent = data;
        }
        else {
            console.error('Error: Response not received');
        }
    })
        .catch(function (error) {
        console.error('Error:', error);
        var messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = 'Failed to connect to server';
        }
        else {
            console.error('Element with ID "message" not found.');
        }
    });
});
