
import { useEffect, useState } from 'react';
import axios from "axios";
import {Film,TVShow,SectionMovies} from '../constant.ts'
import { Card } from './card.tsx';
import Cookies from 'js-cookie';
import Details from './detailsmovie.tsx';
function Searched({film, categorie}:{film: string, categorie: string}) {
    const [searchedFilms, setSearchedFilms] = useState<SectionMovies>();
    const [searchedTv, setSearchedTv] = useState<SectionMovies>();
    const token = Cookies.get('token');
    const [clickedOne, setClicked] = useState<Film | TVShow>();
    const [typeClicked, setType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = categorie==="Film"?(searchedFilms?.totalPages || 1):(searchedTv?.totalPages || 1);
    const currentData = categorie === "Film"
        ? searchedFilms?.pages[currentPage] || []
        : searchedTv?.pages[currentPage] || [];
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categorie === "Film") {
            setLoading(true);
            axios.get(`https://tmdb-database-strapi.onrender.com/api/films?filters[title][$contains]=${film}&pagination[page]=${currentPage}&pagination[pageSize]=12`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((respo) => {
                if (respo.data) {
                    const { data, meta } = respo.data;
                    const page = meta.pagination.page;

                    setSearchedFilms((prev) => {
                        const current = prev ?? { pages: {}, totalPages: 0 };
                        return {
                        pages: {
                            ...current.pages,
                            [page]: data,
                        },
                        totalPages: meta.pagination.pageCount,
                        };
                    });
                }
            }).catch((erreur) => {
                console.error("Erreur lors de la récupération des films :", erreur);

            }).finally(() => {
                setLoading(false);
            })
        } else if(categorie === "TV") {
            setLoading(true);
            axios.get(`https://tmdb-database-strapi.onrender.com/api/Tv-shows?filters[Name][$contains]=${film}&pagination[page]=${currentPage}&pagination[pageSize]=12`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((respo) => {
                if (respo.data) {
                    const { data, meta } = respo.data;
                    const page = meta.pagination.page;

                    setSearchedTv((prev) => {
                        const current = prev ?? { pages: {}, totalPages: 0 };
                        return {
                        pages: {
                            ...current.pages,
                            [page]: data,
                        },
                        totalPages: meta.pagination.pageCount,
                        };
                    });
                }
            }).catch((erreur) => {
                console.error("Erreur lors de la récupération des films :", erreur);

            }).finally(() => {
                setLoading(false);
            }
            )
        }   
    }, [film, categorie, currentPage]);

    const getPaginationRange = (current: number, total: number) => {
    const delta = 2; // Nombre de pages à afficher de chaque côté de la page actuelle
    const range = [];
    const rangeWithDots = [];
    let l: number | null=null ;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
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
  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <>
    {clickedOne && typeClicked?
            <Details type={typeClicked} clicked={clickedOne}  />
            :<div className='flex flex-col'>
        <h1 className="text-2xl font-bold mb-4 mt-4 text-white">Résultats de recherche</h1>
        <div className="grid grid-cols-4 gap-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !Array.isArray(currentData) || currentData.length === 0 ? (
            <p className="text-center col-span-4 text-gray-400 text-lg">Aucun résultat trouvé.</p>
          ) : (
            currentData.map((item: Film | TVShow) => (
              <Card
                key={item.id}
                film={item}
                type={categorie === "Film" ? "movie" : "tv"}
                onClick={() => {
                  setClicked(item);
                  setType(categorie === "Film" ? "movie" : "tv");
                }}
              />
            ))
          )}
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
                    currentPage === p
                      ? "bg-white text-black font-semibold"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setCurrentPage(p as number);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {p}
                </button>
              )
            )}
        </div>
    </div>}
    </>
    
  );
}
export default Searched;