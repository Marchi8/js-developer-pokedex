const pokemonCard = document.getElementById('pokemons');
const pokeTitle = document.getElementsByClassName('pokeTitle')[0];

document.getElementById('returnButton').addEventListener('click',
    () => window.location.href = 'index.html');

const params = new URLSearchParams(window.location.search);
const pokemonName = params.get('name');

const loadPokemonData = (name) => {

    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

    fetch(url)
        .then((response) => response.json())
        .then((res) => pokemonComponent(res))
        .catch((error) => console.error('Erro ao carregar o Pokémon', error));
};

const pokemonComponent = (pokemon) => {
    pokeTitle.textContent = pokemon.name

    const pokemonItem = document.createElement('section');

    const numberSpan = document.createElement('span');
    numberSpan.classList.add('number');
    numberSpan.textContent = `#${pokemon.id}`;

    const detailDiv = document.createElement('div');
    detailDiv.classList.add('detail');

    const typesOl = document.createElement('ol');
    const statsOl = document.createElement('ol');

    const statsDiv = document.createElement('div');
    statsDiv.classList.add('statsDiv',
        pokemon.types.map((typeSlot) => typeSlot.type.name)
            .join(', ')
            .split(', ')[0]
            .trim());
    typesOl.classList.add('types');

    pokemon.types.forEach((obj) => {
        const typeLi = document.createElement('li');
        typeLi.classList.add('type', obj.type.name);
        typeLi.textContent = obj.type.name;
        typesOl.appendChild(typeLi);
    });

    pokemon.stats.forEach((obj) => {
        const statsLi = document.createElement('li');
        const statsName = document.createElement('span');
        const statsValue = document.createElement('span');
        statsLi.classList.add('stats', obj.stat.name);
        statsName.textContent = `${obj.stat.name} `;
        statsValue.textContent = obj.base_stat;
        statsLi.appendChild(statsName)
        statsLi.appendChild(statsValue)
        statsOl.appendChild(statsLi);
    });

    const img = document.createElement('img');
    img.src = pokemon.sprites.other.dream_world.front_default;
    img.alt = pokemon.name;

    detailDiv.appendChild(numberSpan);
    detailDiv.appendChild(typesOl);
    detailDiv.appendChild(img);
    detailDiv.appendChild(statsDiv);

    statsDiv.appendChild(statsOl);

    pokemonItem.appendChild(detailDiv);

    pokemonCard.appendChild(pokemonItem);
};

loadPokemonData(pokemonName)