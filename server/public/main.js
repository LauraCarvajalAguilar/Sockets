var socket = io.connect('192.168.0.9:8081', { 'forceNew': true });

socket.on('messages', function(data) {
    console.log(data);
    render(data);

    vocales = /[aeiou|áéíóú]/ig;
    mayusculas = /(\b[A-Z|ÁÉÍÓÚ])[a-z|áéíóú|A-Z|ÁÉÍÓÚ]*/g;
    numeros = /[\d]/g;
    consonantes = /[a-záéíúóA-ZÁÉÍÓÚ]+([^aeiouáéíóú\? ])\b/g;
})

function render(data) {
    var html = data.map(function(elem, index) {
        return (`<div>
              <strong>${elem.author}</strong>:
              <em>${elem.text}</em>
                <hr>
                <div>Vocales recibidas: <a>${elem.numvocal}</a></div>
                <div>Palabras recibidas: <a>${elem.numpal}</a></div>
                <div>Palabras recibidas que inician con mayúscula: <a>${elem.nummayus}</a></div>
                <div>Números recibidos: <a>${elem.numrec}</a></div>
                <div>Consonantes recibidas: <a>${elem.consonante}</a></div>
            </div>`);
    }).join(" ");

    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {

    var mensaje = document.getElementById('texto').value;

    //Se busca los numeros
    var pruebanum = mensaje.match(numeros);
    try {
        pruebanum = pruebanum.length;
    } catch (error) {
        console.log("El mensaje no tiene ningún número.");
        pruebanum = 0;
    }

    //Se busca las vocales
    var pruebavocal = mensaje.match(vocales);
    try {
        pruebavocal = pruebavocal.length; 
    } catch (error) {
        console.log("El mensaje no contiene ninguna vocal."); 
        pruebavocal = 0;
    }
    
    texto = mensaje;
    //Se cuenta las palabras
    if (texto != "") {
        texto = texto.replace(/\r?\n/g, " ");
        texto = texto.replace(/[ ]+/g, " ");
        texto = texto.replace(/^ /, "");
        texto = texto.replace(/ $/, "");
        var textoTroceado = texto.split(" ");
    }

    var palabras;
    try {
        palabras = textoTroceado.length;
    } catch (error) {
        console.log("El mensaje no contiene ninguna palabra.");
        palabras = 0;
    }

    //Se cuenta las palabras que empiezan con mayúscula
    var pruebamayus = mensaje.match(mayusculas);
    console.log(pruebamayus);

    try {
        pruebamayus = pruebamayus.length;
    } catch (error) {
        console.log("El mensaje no contiene ninguna palabra que comience con mayúscula.");
        pruebamayus = 0;
    }

    //Se buscan consonantes
    var pruebaconso = mensaje.match(consonantes);
    console.log(pruebaconso);

    try {
        pruebaconso = pruebaconso.length;

    } catch (error) {
        console.log("El mensaje no contiene ninguna palabra que comience con mayúscula");
        pruebaconso = 0;
    }

    var message = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value,
        numvocal: pruebavocal,
        numpal: palabras,
        nummayus: pruebamayus,
        numrec: pruebanum,
        consonante: pruebaconso
    };

    socket.emit('new-message', message);
    return false;
}