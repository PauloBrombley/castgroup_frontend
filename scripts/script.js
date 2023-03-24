const form = document.querySelector('.form-control');
const message = document.querySelector('.message');

const usernameLabel = document.getElementById('username-label');

let logged = false;
let timer;

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = form.querySelector('input[type="text"]').value;
    const password = form.querySelector('input[type="password"]').value;

    if (username === "" || password === "") {
        message.textContent = "Por favor, preencha todos os campos.";
    } else {
        fetch('http://localhost:8080/castgroup/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username,
                password: password
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na autenticação.');
                }
                return response.json();
            })
            .then(data => {
                logged = true;
                alert(`Bem-vindo(a) ${data.name}!`);

                // função de logoff após 60 segundos
                setTimeout(() => {
                    fetch('http://localhost:8080/castgroup/logoff', {
                        method: 'GET'
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Falha no logoff.');
                            }
                            alert('Você foi desconectado da sessão.');
                            logged = false;
                        })
                        .catch(error => {
                            console.log(error.message);
                        });
                }, 60000); // 60 segundos em milissegundos
                timer = setTimeout(logout, 60000);
            })
            .catch(error => {
                message.textContent = error.message;
            });
    }
});

function logout() {
    if (logged) {
        usernameLabel.textContent = '';
        clearTimeout(timer);
        fetch('http://localhost:8080/castgroup/logoff', {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha no logoff.');
                }
                form.reset();
                alert('Você foi desconectado da sessão.');
            })
            .catch(error => {
                console.log(error.message);
            });
    }
}