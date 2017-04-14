// Connexion au serveur Socket.io
// avec la même adresse (host + port) que la  page courante
var socket = io();

// Log lorsqu'on est bien connecté
socket.on('connect', function() {
  console.log('Connecté !');
});

// Réception d'un nouveau message
// et ajout dans la liste
socket.on('msg', function(message) {
  // Récupération du user expéditeur du message et de son nickname
  var user = users.filter(function(user) {
    return user.id === message.userId;
  })[0];
  var nickname = user ? user.nickname : '😄';

  // Ajout du message à la liste
  var messages = document.getElementById('messages');
  var li = document.createElement('li');
  li.innerText = nickname + ': ' + message.txt;
  messages.appendChild(li);

  // Scroll en bas de la liste
  messages.scrollTop = messages.scrollHeight - messages.clientHeight;
});

// Réception de la nouvelle liste des connectés
// de type [{id, nickname}, ...]
var usersUl = document.querySelector('#users ul');
var users = [];
socket.on('users', function(_users) {
  // Liste des anciens ids de users pour supprimer les <div> des users déconnectés
  var oldIds = users.map(function(u) {
    return u.id;
  });

  users = _users;
  usersUl.innerHTML = _users.map(function(u) {
    return '<li>' + u.nickname + '</li>'
  }).join('');

  // Affichage des users à l'écran selon leurs positions
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    // Suppression de l'id du user de la liste des anciens ids
    var oldIdIndex = oldIds.indexOf(user.id);
    if (oldIdIndex !== -1) {
      oldIds.splice(oldIdIndex, 1);
    }
    var userDiv = document.getElementById('user-' + user.id);
    // Si le <div> du user n'existe pas encore, on le crée
    if (!userDiv) {
      userDiv = document.createElement('div');
      userDiv.id = 'user-' + user.id;
      userDiv.className = 'user';
      userDiv.innerText = user.nickname;
      document.body.appendChild(userDiv);
    }
  
    userDiv.style.left = user.position.x + '%';
    userDiv.style.top = user.position.y + '%';
  }

  // Suppression des anciens users
  for (var i = 0; i < oldIds.length; i++) {
    var userDiv = document.getElementById('user-' + oldIds[i]);
    if (userDiv) {
      userDiv.parentNode.removeChild(userDiv);
    }
  }
});

// Envoi d'un nouveau message
var msgform = document.getElementById('msgform');
msgform.addEventListener('submit', function(e) {
  e.preventDefault();
  // Texte du champ
  var txt = this.message.value;
  // Commande /nick pour changer de pseudo
  if (txt.indexOf('/nick ') === 0) {
    var nickname = txt.substr(6);
    socket.emit('nick', nickname);
  } else {
    // Envoi d'un message normal
    socket.emit('msg', txt);
  }
  this.message.value = '';
});

// Autofocus sur le champ de texte
msgform.message.focus();

// Click n'importe où sur la page
document.body.addEventListener('click', function(e) {
  // On ne tient pas compte du click si on clique sur un <input>
  if (e.target.tagName === 'INPUT') return;

  // Calcul de la position de la souris en %
  var position = {
    x: e.clientX / window.innerWidth * 100,
    y: e.clientY / window.innerHeight * 100
  };
  // Envoi de la nouvelle position au serveur
  socket.emit('move', position);
});
