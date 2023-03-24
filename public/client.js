const socket = io();
let Name;
let messageArea = document.querySelector(".message_area");
let textarea = document.querySelector("#textarea");
do
{
    Name = prompt("Please Enter the User Name: ");
}while(!Name);

Name = Name.substring(0, 1).toLocaleUpperCase() + Name.substring(1).toLocaleLowerCase(); // Formatting the name.

socket.emit('added', `${Name} joined the chat`);

textarea.focus();

textarea.addEventListener('keyup', (event) => {
    if(event.key === 'Enter')
    {
        if(event.target.value == 0) return; // restricts to send empty message.
        sendMessage(event.target.value);

        textarea.value = '';
    }
});

function sendMessage(message)
{
    let msg = {
        user: Name,
        message: message.trim()
    }
    // Append in message area.
    appendMessage(msg, 'outgoing');

    socket.emit('message', msg);

}

function appendMessage(msg, type)
{
    let mainDiv = document.createElement('div');
    let className = type;
    
    let markup;

    if(type === 'join')
    {
        mainDiv.classList.add(className);
        markup = `${msg}`;
    }
    else
    {
        mainDiv.classList.add(className, 'message');
        markup = `
            <h4>${msg.user}</h4>
            <p>${msg.message}</p>
        `
    }

    mainDiv.innerHTML = markup;

    messageArea.appendChild(mainDiv);
}


// Recieve Messages

socket.on('added', (msg) => {
    appendMessage(msg, 'join');
});

socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
});