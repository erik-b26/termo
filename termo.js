let secreta = ''
let primeiraCorreta = 0
let primeiraErrada = 0
let primeiraInexistente = 0
let tentativas = 0
let letrasDescobertas = new Set();

window.addEventListener('load', async () => {
    try {
        const response = await fetch('/get-word');
        if (!response.ok) {
            const body = await response.text();
            throw new Error('Falha ao obter palavra do servidor: ' + response.status + ' - ' + body);
        }
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const body = await response.text();
            throw new Error('Resposta inesperada do servidor: ' + body);
        }
        const data = await response.json();
        secreta = data.word.toLowerCase();
        document.getElementById('palpiteInput').disabled = false;
        document.getElementById('submit').disabled = false;
    } catch (err) {
        console.error('Error fetching word:', err);
        document.getElementById('mensagem').innerHTML = 'Erro ao obter a palavra do servidor: ' + err.message;
        document.getElementById('palpiteInput').disabled = true;
        document.getElementById('submit').disabled = true;
    }
});

document.getElementById('submit').addEventListener('click', function() {
  let palpite = document.getElementById('palpiteInput').value.toLowerCase();
    if (palpite.length !== 5 || tentativas >= 5) return;
    
    tentativas++;
    document.getElementById('mensagem').innerHTML = '';
    primeiraCorreta = 0;
    primeiraErrada = 0;
    primeiraInexistente = 0;
    document.getElementById('corretas').innerHTML = 'Lugar Certo';
    document.getElementById('erradas').innerHTML = '';
    document.getElementById('inexistentes').innerHTML = '';
    const correctBoxes = document.querySelectorAll('#correctBoxes .correct-box');
    correctBoxes.forEach(box => box.textContent = '');
    
    for(let i = 0; i < 5; i++){
        if (secreta[i] === palpite[i]) {
            correctBoxes[i].textContent = palpite[i];
        }
        // ...existing code for erradas e inexistentes...
        if (secreta[i] !== palpite[i]) {
            if (secreta.includes(palpite[i])) {
                letrasDescobertas.add(palpite[i]);
                if(primeiraErrada == 0){
                    document.getElementById('erradas').innerHTML += "lugar errado: " + palpite[i]
                }else{
                    document.getElementById('erradas').innerHTML += "-" + palpite[i]    
                }
                primeiraErrada++
            } else {
                if(primeiraInexistente == 0){
                    document.getElementById('inexistentes').innerHTML += "não existe: " + palpite[i]
                } else {
                    document.getElementById('inexistentes').innerHTML += "-" + palpite[i]
                }
                primeiraInexistente++
            }
        }
    }


    document.getElementById('letrasCertas').innerHTML = 'Letras certas na palavra: ' + Array.from(letrasDescobertas).join(', ');
    if (palpite === secreta) {
        document.getElementById('mensagem').innerHTML = "Você acertou a palavra!";
        document.getElementById('palpiteInput').disabled = true;
        document.getElementById('submit').disabled = true;
    } else if (tentativas >= 5) {
        document.getElementById('mensagem').innerHTML = "Você perdeu! A palavra era: " + secreta;
        document.getElementById('palpiteInput').disabled = true;
        document.getElementById('submit').disabled = true;
    }
    document.getElementById('palpiteInput').value = '';
});


document.getElementById('hardMode').addEventListener('click', async function() {
    mode = 'hard';
    document.body.classList.add('hard-mode');
    // Reset game
    tentativas = 0;
    letrasDescobertas.clear();
    document.getElementById('mensagem').innerHTML = '';
    document.getElementById('corretas').innerHTML = 'Lugar Certo';
    document.getElementById('erradas').innerHTML = '';
    document.getElementById('inexistentes').innerHTML = '';
    document.getElementById('letrasCertas').innerHTML = 'Letras certas na palavra: ';
    const correctBoxes = document.querySelectorAll('#correctBoxes .correct-box');
    correctBoxes.forEach(box => box.textContent = '');
    document.getElementById('palpiteInput').value = '';
    document.getElementById('palpiteInput').disabled = true;
    document.getElementById('submit').disabled = true;
    // Fetch new word
    try {
        const response = await fetch(`/get-word?mode=${mode}`);
        const data = await response.json();
        secreta = data.word.toLowerCase();
        document.getElementById('palpiteInput').disabled = false;
        document.getElementById('submit').disabled = false;
        document.getElementById('mensagem').innerHTML = 'Modo Hard ativado!';
    } catch (err) {
        console.error('Error fetching word:', err);
        secreta = 'teste';
        document.getElementById('mensagem').innerHTML = 'Erro, usando palavra padrão: teste';
        document.getElementById('palpiteInput').disabled = false;
        document.getElementById('submit').disabled = false;
    }
});
document.getElementById('normalMode').addEventListener('click', async function() {
    mode = 'normal';
    document.body.classList.remove('hard-mode');
    // Reset game
    tentativas = 0;
    letrasDescobertas.clear();
    document.getElementById('mensagem').innerHTML = '';
    document.getElementById('corretas').innerHTML = 'Lugar Certo';
    document.getElementById('erradas').innerHTML = '';
    document.getElementById('inexistentes').innerHTML = '';
    document.getElementById('letrasCertas').innerHTML = 'Letras certas na palavra: ';
    const correctBoxes = document.querySelectorAll('#correctBoxes .correct-box');
    correctBoxes.forEach(box => box.textContent = '');
    document.getElementById('palpiteInput').value = '';
    document.getElementById('palpiteInput').disabled = true;
    document.getElementById('submit').disabled = true;
    // Fetch new word
    try {
        const response = await fetch(`/get-word?mode=${mode}`);
        const data = await response.json();
        secreta = data.word.toLowerCase();
        document.getElementById('palpiteInput').disabled = false;
        document.getElementById('submit').disabled = false;
        document.getElementById('mensagem').innerHTML = 'Modo Tradicional ativado!';
    } catch (err) {
        console.error('Error fetching word:', err);
        secreta = 'teste';
        document.getElementById('mensagem').innerHTML = 'Erro, usando palavra padrão: teste';
        document.getElementById('palpiteInput').disabled = false;
        document.getElementById('submit').disabled = false;
    }
});
//teste