const urlPokemon = "https://pokeapi.co/api/v2/pokemon/";
const numeroPokemon = 10;

async function recuperaPesoPokemon() {
    const lista = [];

    for (let i = 1; i <= numeroPokemon; i++) {
        lista.push(fetch(urlPokemon + i).then(risposta => {
            if (!risposta.ok) {
                throw new Error(`Errore nel ID ${i}`);
            }
            return risposta.json();
        }));
    }

    try {
        const risultati = await Promise.all(lista);
        return risultati;
    } catch (errore) {
        console.error("Errore :", errore);
        const contenitore = document.querySelector('.contenitore');
        const listaGrafico = document.getElementById('grafico');
        if (listaGrafico) {
            listaGrafico.style.display = 'none';
        }
        if (contenitore) {
            contenitore.innerHTML = `<h1>Errore dati</h1><p>Non funziona.</p>`;
        }
    }
}

function dati(datiPokemon) {
    const labels = datiPokemon.map(p => 
        p.name.charAt(0) + p.name.slice(1)
    );
    
    const datiPeso = datiPokemon.map(p => p.weight); 

    return { labels, datiPeso };
}

async function disegnaGrafico() {
    const risultatiPokemon = await recuperaPesoPokemon();

    if (!risultatiPokemon) {
        return;
    }

    const { labels, datiPeso } = dati(risultatiPokemon);

    const datiGrafico = {
        labels: labels,
        datasets: [
            {
                label: 'Peso',
                data: datiPeso,
                backgroundColor: 'rgba(25, 222, 236, 0.7)',
                borderColor: 'rgba(128, 74, 86, 1)',
                borderWidth: 1
            }
        ]
    };

    const config = {
        type: 'bar',
        data: datiGrafico,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Confronto peso dei primi ${numeroPokemon} Pokémon`
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Peso'
                    }
                }
            }
        }
    };

    const canvasElement = document.getElementById('grafico');
    if (canvasElement) {
        const perGrafico = canvasElement.getContext('2d');
        new Chart(perGrafico, config);
    }
}

disegnaGrafico();