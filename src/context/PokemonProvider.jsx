import { useEffect, useState } from 'react';
import { useForm } from '../hook/useForm';
import { PokemonContext } from './PokemonContext';

export const PokemonProvider = ({ children }) => {
	const [allPokemons, setAllPokemons] = useState([]);
	const [globalPokemons, setGlobalPokemons] = useState([]);
	const [offset, setOffset] = useState(0);

	// Utilizar CustomHook - useForm
	const { valueSearch, onInputChange, onResetForm } = useForm({
		valueSearch: '',
	});

	// Estados para la aplicación simples
	const [loading, setLoading] = useState(true);
	const [active, setActive] = useState(false);

	// lLamar 50 pokemones a la API
	const getAllPokemons = async (limit = 50) => {
		const baseURL = 'https://pokeapi.co/api/v2/';

		const res = await fetch(
			`${baseURL}pokemon?limit=${limit}&offset=${offset}`
		);
		const data = await res.json();

		const promises = data.results.map(async pokemon => {
			const res = await fetch(pokemon.url);
			const data = await res.json();
			return data;
		});
		const results = await Promise.all(promises);

		setAllPokemons([...allPokemons, ...results]);
		setLoading(false);
	};

	// Llamar todos los pokemones
	const getGlobalPokemons = async () => {
		const baseURL = 'https://pokeapi.co/api/v2/';

		const res = await fetch(
			`${baseURL}pokemon?limit=100000&offset=0`
		);
		const data = await res.json();

		const promises = data.results.map(async pokemon => {
			const res = await fetch(pokemon.url);
			const data = await res.json();
			return data;
		});
		const results = await Promise.all(promises);

		setGlobalPokemons(results);
		setLoading(false);
	};

	// Llamar a un pokemon por ID
	const getPokemonByID = async id => {
		const baseURL = 'https://pokeapi.co/api/v2/';

		const res = await fetch(`${baseURL}pokemon/${id}`);
		const data = await res.json();
		return data;
	};

	useEffect(() => {
		getAllPokemons();
	}, [offset]);

	useEffect(() => {
		getGlobalPokemons();
	}, []);

	// BTN CARGAR MÁS
	const onClickLoadMore = () => {
		setOffset(offset + 50);
	};

	// Filter Function + State
	const [typeSelected, setTypeSelected] = useState({
		grass: false,
		normal: false,
		fighting: false,
		flying: false,
		poison: false,
		ground: false,
		rock: false,
		bug: false,
		ghost: false,
		steel: false,
		fire: false,
		water: false,
		electric: false,
		psychic: false,
		ice: false,
		dragon: false,
		dark: false,
		fairy: false,
		unknow: false,
		shadow: false,
	});

	const [filteredPokemons, setfilteredPokemons] = useState([]);

	const handleCheckbox = (e) => {
		const { name, checked } = e.target;
	  
		setTypeSelected({
		  ...typeSelected,
		  [name]: checked,
		});
	  
		if (checked) {		  
		  setfilteredPokemons((prevFilteredPokemons) => {
			const filteredResults = globalPokemons.filter((pokemon) =>
			  pokemon.types.map((type) => type.type.name).includes(name)
			);
			return [...prevFilteredPokemons, ...filteredResults];
		  });
		} else {		  
		  setfilteredPokemons((prevFilteredPokemons) => {
			const filteredResults = prevFilteredPokemons.filter(
			  (pokemon) =>
				!pokemon.types.map((type) => type.type.name).includes(name)
			);
			return filteredResults;
		  });
		}
	  };
	  

	return (
		<PokemonContext.Provider
			value={{
				valueSearch,
				onInputChange,
				onResetForm,
				allPokemons,
				globalPokemons,
				getPokemonByID,
				onClickLoadMore,
				// Loader
				loading,
				setLoading,
				// Btn Filter
				active,
				setActive,
				// Filter Container Checkbox
				handleCheckbox,
				filteredPokemons,
			}}
		>
			{children}
		</PokemonContext.Provider>
	);
};