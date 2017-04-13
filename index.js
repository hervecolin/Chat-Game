const uuid = require('uuid/v4');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const port = 8080;

// Instanciation du serveur web, de Express et de Socket.io
const app = express();
const server = http.Server(app);
const io = socketio(server);

// Lancement du serveur HTTP
server.listen(port, () => {
    console.log('Listening on port ' + port);
});

// Contenu du dossier public accessible sur le web
app.use('/', express.static(__dirname + '/public'));

const users=[];            // déclaration de ma liste users avant Connexion !


// Connexion des clients socket.io
io.on('connection', (socket) => {

    console.log('User (' + socket.id + ') vient de se connecter');

    const user = {       //creation d'un user !
      id:socket.id,
      name:socket.id
    };
    users.push(user);      //pour ajouter un utilisateur ou un element dans io indexOf trouver un element splice retirer un ou plusieur éléments
    // const message = {
    //  id: uuid(),
    // userId: user.id,
    // date: new date.getTime(),
    // txt: message.txt
    // socket.broadcast.emit(name, date);
    // };
    io.emit('users', users);



    // Déconnexion de l'utilisateur
    socket.on('disconnect', () => {

        console.log('User (' + socket.id + ') vient de se déconnecter');
        users.splice(users.indexOf(user), 1);  //enlever l'utilisateur lors de la deconnect
        io.emit('users', users);
    });

    // Réception d'un nouveau message
    socket.on('msg', (txt) => {
        // Diffusion du message auprès de tous les connectés
        io.emit('msg', txt);
    });
});
