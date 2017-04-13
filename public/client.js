// Connexion au serveur Socket.io
// avec la même adresse (host + port) que la  page courante
var socket = io();

// Log lorsqu'on est bien connecté
socket.on('connect', function() {
    console.log('Connecté !');
});

// Réception d'un nouveau message
// et ajout dans la liste
socket.on('msg', function(txt) {
    var messages = document.getElementById('messages');
    var li = document.createElement('li');
    li.innerText = txt;
    messages.appendChild(li);
});

// Réception de la nouvelle liste des connectés
// de type [{id, name}, ...]

var usersUl = document.querySelector('#users ul');
socket.on('users', function(users) {
    usersUl.innerHTML = users.map(u => '<li>' + u.name + '</li>').join('')  //function pour récupérer name utilisateur
    console.log(users);
});

// Envoi d'un nouveau message
var msgform = document.getElementById('msgform');
msgform.addEventListener('submit', function(e) {
    e.preventDefault();
    socket.emit('msg', this.message.value);
    this.message.value = '';
});

// Autofocus sur le champ de texte
msgform.message.focus();
