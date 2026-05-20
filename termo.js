let secreta = ''
let mode = 'normal';
const maxTentativas = 6;
let tentativas = 0
let letrasDescobertas = new Set();
let letrasInexistentes = new Set();

function atualizarChances() {
    const chancesRestantes = Math.max(0, maxTentativas - tentativas);
    document.getElementById('chances').innerHTML = 'Chances: ' + chancesRestantes;
}

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
        atualizarChances();
    } catch (err) {
        console.error('Error fetching word:', err);
        document.getElementById('mensagem').innerHTML = 'Erro ao obter a palavra do servidor: ' + err.message;
        document.getElementById('palpiteInput').disabled = true;
        document.getElementById('submit').disabled = true;
    }
});

document.getElementById('submit').addEventListener('click', function() {
  let palpite = document.getElementById('palpiteInput').value.toLowerCase();
    if (palpite.length !== 5 || tentativas >= maxTentativas) return;
    
    tentativas++;
    atualizarChances();
    document.getElementById('mensagem').innerHTML = '';
    document.getElementById('corretas').innerHTML = 'Lugar Certo';
    document.getElementById('erradas').innerHTML = '';
    document.getElementById('inexistentes').innerHTML = '';
    const correctBoxes = document.querySelectorAll('#correctBoxes .correct-box');
    
    for(let i = 0; i < 5; i++){
        if (secreta[i] === palpite[i]) {
            const boxIndex = mode === 'hard' ? 4 - i : i;
            correctBoxes[boxIndex].textContent = palpite[i];
        }
        // ...existing code for erradas e inexistentes...
        if (secreta[i] !== palpite[i]) {
            if (secreta.includes(palpite[i])) {
                letrasDescobertas.add(palpite[i]);
            } else {
                letrasInexistentes.add(palpite[i]);
                // Inexistentes será atualizado abaixo.
            }
        }
    }

    correctBoxes.forEach(box => {
        const letra = box.textContent.trim();
        if (letra) {
            letrasDescobertas.delete(letra);
        }
    });

    if (letrasInexistentes.size > 0) {
        document.getElementById('inexistentes').innerHTML = 'não existe: ' + Array.from(letrasInexistentes).join(', ');
    }


    document.getElementById('letrasCertas').innerHTML = 'Letras certas na palavra: ' + Array.from(letrasDescobertas).join(', ');
    if (palpite === secreta) {
        document.getElementById('mensagem').innerHTML = "Você acertou a palavra!";
        document.getElementById('palpiteInput').disabled = true;
        document.getElementById('submit').disabled = true;
    } else if (tentativas >= maxTentativas) {
        document.getElementById('mensagem').innerHTML = "Você perdeu! A palavra era: " + secreta;
        document.getElementById('palpiteInput').disabled = true;
        document.getElementById('submit').disabled = true;
    }
    document.getElementById('palpiteInput').value = '';
});

document.getElementById('palpiteInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('submit').click();
    }
});

document.getElementById('hardMode').addEventListener('click', function() {
    mode = 'hard';
    document.body.classList.add('hard-mode');
    document.getElementById('mensagem').innerHTML = 'Modo Hard ativado!';
});
document.getElementById('normalMode').addEventListener('click', function() {
    mode = 'normal';
    document.body.classList.remove('hard-mode');
    document.getElementById('mensagem').innerHTML = 'Modo Tradicional ativado!';
});
//teste