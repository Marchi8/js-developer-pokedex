const pokemonList = document.getElementById('pokemons');
const loadMoreButton = document.getElementById('loadMoreButton');
const loadLessButton = document.getElementById('loadLessButton');

let offSet = 0;
let limit = 12;
const maxRecords = 1269;

const loadPokemonItens = (offSet, limit) => {
    if (offSet == 0) {
        loadLessButton.style.display = 'none'
    } else {
        loadLessButton.style.display = 'block'
    }

    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offSet}&limit=${limit}`;

    fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((res) => fetchPokemon(res));
};

const fetchPokemon = (pokelist) => {
    Promise.all(pokelist.map((pokemon) => fetch(pokemon.url).then((response) => response.json())))
        .then((pokeData) => {
            pokemonComponent(pokeData);
        })
        .catch((error) => console.error('Erro ao carregar os Pokémon', error));
};

const pokemonComponent = (pokeData) => {
    pokemonList.innerHTML = ''

    pokeData.forEach((pokemon) => {
        const pokemonItem = document.createElement('button');
        pokemonItem.classList.add('pokemon',
            pokemon.types.map((typeSlot) => typeSlot.type.name)
                .join(', ')
                .split(', ')[0]
                .trim());

        const numberSpan = document.createElement('span');
        numberSpan.classList.add('number');
        numberSpan.textContent = `#${pokemon.id}`;

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('name');
        nameSpan.textContent = pokemon.name;

        const detailDiv = document.createElement('div');
        detailDiv.classList.add('detail');

        const typesOl = document.createElement('ol');
        typesOl.classList.add('types');

        pokemon.types.forEach((obj) => {
            const typeLi = document.createElement('li');
            typeLi.classList.add('type', obj.type.name);
            typeLi.textContent = obj.type.name;
            typesOl.appendChild(typeLi);
        });

        const img = document.createElement('img');
        img.src = pokemon.sprites.other.dream_world.front_default;
        img.alt = pokemon.name;

        detailDiv.appendChild(typesOl);
        detailDiv.appendChild(img);

        pokemonItem.appendChild(numberSpan);
        pokemonItem.appendChild(nameSpan);
        pokemonItem.appendChild(detailDiv);

        pokemonList.appendChild(pokemonItem);

        pokemonItem.addEventListener('click',
            () => window.location.href = `pokemonDetails.html?name=${pokemon.name}`)
    });
};

loadPokemonItens(offSet, limit);

loadMoreButton.addEventListener('click', () => {
    offSet += limit;
    const qtdRecordsWithNextPage = offSet + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offSet;
        loadPokemonItens(offSet, newLimit);

        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
        loadPokemonItens(offSet, limit);
    }
});

loadLessButton.addEventListener('click', () => {
    if (offSet >= limit) {
        const newOffset = offSet - limit;
        const newLimit = limit;

        offSet = newOffset;

        loadPokemonItens(offSet, newLimit);

        const qtdRecordsWithNextPage = offSet + limit;
        if (qtdRecordsWithNextPage >= maxRecords) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    }
});