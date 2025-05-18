import Details from './detailsmovie'
import Header from './header.tsx';
import { useEffect, useState } from 'react';
import './Acceuil.css'
import axios from "axios";
import {Film,CommentCount,TVShow,MoviesBySection} from '../constant.ts'
import { Card } from './card.tsx';
import { Navigate } from "react-router";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import Searched from './Searched.tsx';
function Movie({refresh }: {refresh:boolean }) {
    const sections = [
        "Tout",             
        "Populaires",      
        "Nouveautés",      
        "Action",
        "Aventure",
        "Comédie",
        "Science-fiction",
        "Animation",
        "Drame"
        ];
    const [selectedSection, setSelectedSection] = useState("Tout");
    const [moviesBySection, setMoviesBySection] = useState<MoviesBySection>({});
    const [page, setPage] = useState(1);
    const token=Cookies.get('token');
    const [genreIdMap, setGenreIdMap] = useState<Record<string, number>>({});
    const [clickedOne,setClicked]=useState<Film>();
    const[typeClicked,setType]=useState("");
    const [isAddingFilter, setIsAddingFilter] = useState(false);
    const totalPages = Math.ceil(moviesBySection[selectedSection]?.totalPages/16) || 1;
    const [filters, setFilters] = useState<{ field: string; operator: string; value: string }[]>([]);
    const[searchTerm,setSearchTerm]=useState<string>();
    const [category,setCategory]=useState<string>();

    const handleSearchedFilm = (film: string , categorie: string) => {
        setSearchTerm(film);
        setCategory(categorie);
  };

 useEffect(() => {
   const fetchGenres = async () => {
    try {
      const response = await axios.get("https://tmdb-database-strapi.onrender.com/api/genre-tv-shows?pagination[pageSize]=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Construire la map : nom => id
      const genres = response.data.data;
      const map: Record<string, number> = {};
      genres.forEach((genre: any) => {
        map[genre.nom_genre] = genre.id_genre;
      });

      setGenreIdMap(map);
    } catch (error) {
      console.error("Erreur lors du chargement des genres :", error);
    }
  };

  fetchGenres();
}, []);

    async function fetchMovies(section, page) {
    // Si on a déjà la page dans le cache, on ne refait pas le fetch
    if (
      moviesBySection[section] &&
      moviesBySection[section].pages &&
      moviesBySection[section].pages[page]
    ) {
      return;
    }

    try {
    const url = getUrl(selectedSection, page);
    const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
    });

      const { data, meta } = response.data;

      setMoviesBySection((prev) => {
        const sectionData = prev[section] || { pages: {}, totalPages: 0 };

        return {
          ...prev,
          [section]: {
            pages: {
              ...sectionData.pages,
              [page]: data,
            },
            totalPages: meta.pagination.total,
          },
        };
      });
    } catch (error) {
      console.error("Erreur fetch movies:", error);
    }
  }

  const getUrl=(section:string,page:number):string=>{
        const baseUrl = "https://tmdb-database-strapi.onrender.com/api/films";
        const pagination = `pagination[page]=${page}&pagination[pageSize]=15`;

        if (section === "Tout") {
            return `${baseUrl}?${pagination}`;
        }

        if (section === "Populaires") {
            return `${baseUrl}?sort=popularity_tmdb:desc&${pagination}`;
        }

        if (section === "Nouveautés") {
            return `${baseUrl}?sort=release_date:desc&${pagination}`;
        }

        const genreId = genreIdMap[section];
        if (genreId !== undefined) {
            return `${baseUrl}?filters[$or][0][genre_tv_films][$containsi]=, ${genreId}]&filters[$or][1][genre_tv_films][$containsi]=[${genreId},&filters[$or][2][genre_tv_films][$containsi]=, ${genreId},&${pagination}`;
        }
        return `${baseUrl}?${pagination}`;
  }

    useEffect(() => {
        fetchMovies(selectedSection, page);
    }, [selectedSection, page]);


    const getPaginationRange = (current: number, total: number) => {
    const delta = 2; // Nombre de pages à afficher de chaque côté de la page actuelle
    const range = [];
    const rangeWithDots = [];
    let l: number;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };
  const paginationRange = getPaginationRange(page, totalPages);

  useEffect(()=>{
        setClicked(undefined);
        setType("");
        setSearchTerm("");
        setCategory("");
    },[refresh]);


  return (
    <div className='flex flex-col h-full px-10 main'>
     <Header search={handleSearchedFilm}/>
    {clickedOne && typeClicked?
            <Details type={typeClicked} clicked={clickedOne} />
        
        :(searchTerm!="" && category)?
        <Searched film={searchTerm} categorie={category} />
        :<main className='flex flex-col w-full h-full mt-10'>
        <div className="flex py-4 justify-between items-center">
          <div className='flex'>
            {sections.map((section) => (
            <button
                key={section}
                className={`px-4 mr-4 py-2 rounded-full text-sm whitespace-nowrap ${
                selectedSection === section
                    ? "bg-white text-black font-semibold"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
                onClick={() => {setSelectedSection(section);setPage(1);}}
            >
                {section}
            </button>
            ))}
          </div>

            <div className='flex items-center rounded-2xl bg-gray-800 px-4 py-2 anime ' onClick={() => setIsAddingFilter(true)}>
              <FontAwesomeIcon icon={faFilter} className='mr-2 text-gray-400 text-sm'/>
              <p className='text-gray-400 text-sm '>Filters</p>
            </div>

        </div>
        <div className='flex flex-col mt-2'>
          <p className='font-bold text-white text-2xl'>Filtres</p>
          {/*ici je vais avec les div des filtre appliquer avec le croix */}
        </div>
        <div className='flex flex-wrap mt-4'>
            {moviesBySection[selectedSection]?.pages[page]?.map((film: Film) => (
                <Card key={film.id} film={film} type="movie" onClick={() => {
                    setClicked(film);
                    setType("movie");
                }} />
            ))}
        </div>
        <div className="flex justify-center mt-4 pb-8">
            {paginationRange.map((p, index) =>
              p === "..." ? (
                <span key={`dots-${index}`} className="px-2 py-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  className={`px-4 py-2 mx-1 rounded-full text-sm ${
                    page === p
                      ? "bg-white text-black font-semibold"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setPage(p as number);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {p}
                </button>
              )
            )}
        </div>
    </main>}
    </div>
  );
}
export default Movie;