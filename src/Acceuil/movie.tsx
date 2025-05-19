import Details from './detailsmovie'
import Header from './header.tsx';
import { useEffect, useState } from 'react';
import './Acceuil.css'
import axios from "axios";
import {Film,TVShow,MoviesBySection,genreEntity} from '../constant.ts'
import { Card } from './card.tsx';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import Searched from './Searched.tsx';
import DatePicker from "react-datepicker";
import toast from 'react-hot-toast';
import { useUser } from '../Context/UserContext';

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
    const [reverse,setReverse]=useState(false);
    const[reverse2,setReverse2]=useState(false);
    const[reverse3,setReverse3]=useState(false);
    const[annee,setAnnee]=useState("Année");
    const[alphabetique,setAlphabetique]=useState("Alphabetique");
    const[langue,setLangue]=useState("Langue");
    const[deletedFilter,setDeletedFilter]=useState(false);
    const getAlphabetique = () => {
        const alphabetique = ["A-Z","Z-A"];
        return alphabetique;
      }

    const getYears = () => {
        const Year = new Date().getFullYear() + 1;
        return Array.from(new Array(10), (val, index) => `${Year - (index)}`);
      }
    const [selectedSection, setSelectedSection] = useState("Tout");
    const [moviesBySection, setMoviesBySection] = useState<MoviesBySection>({});
    const [page, setPage] = useState(1);
    const token=Cookies.get('token');
    const [genreIdMap, setGenreIdMap] = useState<Record<string, string>>({});
    const [clickedOne,setClicked]=useState<Film | TVShow>();
    const[typeClicked,setType]=useState("");
    const totalPages = Math.ceil(((moviesBySection[selectedSection]?.totalPages)|| 15)/15) || 1;
    const[searchTerm,setSearchTerm]=useState<string>("");
    const [category,setCategory]=useState<string>("");
    const [moviesFiltred, setMovieFiltred] = useState([]);
    const[pageFiltred,setPageFiltred]=useState(1);
    const [totalPagesFiltred, setTotalPagesFiltred] = useState(1);
    const [filtreAppliquer,setfiltreAppliquer]=useState(false);
    const [cliquked,setclick]=useState(false);
    const[loading,setLoading]=useState(false);
    const[loadingFiltred,setLoadingFiltred]=useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { user } = useUser();
        const[nom,setNom]=useState(user?.Nom_user);
        const[prenom,setPrenom]=useState(user?.Prenom_user);
        const [dateNaissance, setDateNaissance] = useState<Date | null>(user?.Date_naissance ? new Date(user.Date_naissance) : null);
        const[email,setEmail]=useState(user?.email_user);
        const[password,setPassword]=useState('');
        const { setUser } = useUser();

        const handleclick=()=>{
        const data = {
            Nom_user: nom,
            Prenom_user: prenom,
            Date_naissance: dateNaissance,
            email: email
        };
        axios.put(`https://tmdb-database-strapi.onrender.com/api/users/${user?.id}`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log(response.data);
            toast.success("Modifications effectuées avec succès");
            const pers = {
                id: response.data.id,
                Nom_user: response.data.Nom_user,
                Prenom_user: response.data.Prenom_user,
                Date_naissance: response.data.Date_naissance,
                email_user: response.data.email_user,
            }
            Cookies.set('user', JSON.stringify(pers), { expires: 1/24, secure: true, sameSite: 'strict' });
            setUser(pers);
        })
        .catch((error) => {
            console.error(error);
        }).finally(() => {
            setShowProfile(false);
            setNom(user?.Nom_user);
            setPrenom(user?.Prenom_user);
            setDateNaissance(user?.Date_naissance ? new Date(user.Date_naissance) : null);
            setEmail(user?.email_user);
            setPassword('');
        });
    }

    const handleSearchedFilm = (film: string , categorie: string) => {
        setSearchTerm(film);
        setCategory(categorie);
  };

  useEffect(() => {
  setAnnee("Année");
  setAlphabetique("Alphabetique");
  setLangue("Langue");
  setfiltreAppliquer(false);
  setPage(1);
}, [selectedSection,refresh]);

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
      const map: Record<string, string> = {};
      genres.forEach((genre: genreEntity) => {
        map[genre.nom_genre] = genre.id_genre;
      });

      setGenreIdMap(map);
    } catch (error) {
      console.error("Erreur lors du chargement des genres :", error);
    }
  };

  fetchGenres();
}, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoadingFiltred(true);
        let baseUrl = "https://tmdb-database-strapi.onrender.com/api/films";
        const pagination = `pagination[page]=${pageFiltred}&pagination[pageSize]=15`;
          if (selectedSection === "Tout") {
            baseUrl += `?${pagination}`;
        } else if (selectedSection === "Populaires") {
            baseUrl += `?sort=popularity_tmdb:desc&${pagination}`;
        } else if (selectedSection === "Nouveautés") {
            baseUrl += `?sort=release_date:desc&${pagination}`;
        } else {
            const genreId = genreIdMap[selectedSection];
            if (genreId !== undefined) {
                baseUrl += `?filters[$or][0][genre_tv_films][$containsi]=, ${genreId}]&filters[$or][1][genre_tv_films][$containsi]=[${genreId},&filters[$or][2][genre_tv_films][$containsi]=, ${genreId},&${pagination}`;
            }
        }
        if(annee!="Année"){
            const anneeNum = Number(annee);
            baseUrl+=`&filters[release_date][$containsi]=${anneeNum}`;
        }
        if(alphabetique!="Alphabetique"){
            baseUrl+=`&sort=title:${alphabetique=="A-Z"?"asc":"desc"}`;
        }
        if (langue !== "Langue") {
          baseUrl += `&filters[original_language][$eq]=${langue.toLowerCase()}`;
        }
        const response = await axios.get(baseUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { data, meta } = response.data;
        setMovieFiltred(data);
        if(meta.pagination.pageCount!=0){
        setTotalPagesFiltred(meta.pagination.pageCount);
        }

      } catch (error) {
        console.error("Erreur fetch movies:", error);
      }finally {
        setLoadingFiltred(false);
      }
    };
    fetchMovies();
  }, [filtreAppliquer,selectedSection, pageFiltred,cliquked,deletedFilter]);

    async function fetchMovies(section:string, page:number) {
    // Si on a déjà la page dans le cache, on ne refait pas le fetch
    if (
      moviesBySection[section] &&
      moviesBySection[section].pages &&
      moviesBySection[section].pages[page]
    ) {
      return;
    }

    try {
      setLoading(true);
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
    }finally {
        setLoading(false);
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
  const paginationRange = getPaginationRange(page, totalPages);
  const filtredpaginationRange = getPaginationRange(pageFiltred, totalPagesFiltred);

  useEffect(()=>{
        setClicked(undefined);
        setType("");
        setSearchTerm("");
        setCategory("");
    },[refresh]);


  return (
    <>
    {showProfile?<div className='fixed top-0 left-0 w-full h-full bg-black opacity-80 z-20 '>
                
                <div className='absolute top-1/2 left-1/2 transform w-[464px] -translate-x-1/2 -translate-y-1/2  rounded-xl py-10 px-10' style={{background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)", backdropFilter: "blur(8px)"}}>
                    <p className='text-white text-lg font-bold'>Mon Profil</p>
                   <div className="flex flex-col mt-3">
                    <button
                        onClick={()=> {setShowProfile(false)}}
                        type="button"
                        className="absolute h-5 text-center top-[-12px] right-[-18px]  text-white text-[12px] bg-gray-500  rounded-full px-[7px] anime"
                      >
                        &times;
                      </button>
                                   <label  className=" text-white">Nom</label>
                                   <input type="text" value={nom} className="pl-1 mt-1 h-10 rounded-lg bg-transparent border-2 border-solid border-white focus:border-4 text-white outline-none placeholder:text-gray-300" placeholder="exemple:Sadi" onChange={(e)=>{
                                     setNom(e.target.value);
                                    
                                   }}></input>
                               </div>
                               <div className="flex flex-col mt-3">
                                   <label  className=" text-white">Prenom</label>
                                   <input type="text" value={prenom} className="pl-1 mt-1 h-10 rounded-lg bg-transparent border-2 border-solid border-white focus:border-4 text-white outline-none placeholder:text-gray-300"  placeholder="exemple:massin" onChange={(e)=>{
                                     setPrenom(e.target.value);
                                     
                                   }}></input>
                               </div>
                               <div className="flex flex-col mt-3">
                                   <label  className=" text-white">Email adresse</label>
                                   <input type="email" value={email} className="pl-1 mt-1 h-10 rounded-lg bg-transparent border-2 border-solid border-white focus:border-4 text-white outline-none placeholder:text-gray-300" placeholder="exemple123@gmail.com" onChange={(e)=>{
                                     setEmail(e.target.value);
                                     
                                   }}></input>
                               </div>
                               <div className="flex flex-col mt-3">
                                   <label className=" text-white">Mot de passe</label>
                                   <input type="password" value={password}  className="pl-1 mt-1 h-10 rounded-lg bg-transparent border-2 border-solid  border-white outline-none focus:border-4 text-white placeholder:text-gray-300"  placeholder="************" onChange={(e)=>{
                                     setPassword(e.target.value);
                                     
                                   }}></input>
                               </div>
                               <div className="flex mt-2">
                               <div className="flex flex-col ml-1">
                               <label className=" text-white">Date de naissance</label>
                               <DatePicker
                                 selected={dateNaissance}
                                 onChange={(date) => setDateNaissance(date)}
                                 dateFormat="dd/MM/yyyy"
                                 showYearDropdown
                                 scrollableYearDropdown
                                 yearDropdownItemNumber={100} // montre les 100 dernières annees
                                 maxDate={new Date()}         
                                 placeholderText="Choisir une date"
                                 withPortal={false}
                                 className="p-2 mt-1 border-2 border-solid  border-white text-white rounded-lg"
                               />
                   
                               </div>
                   
                               </div>
                           
                   
                               <div className='flex w-full items-center justify-center mt-8'>
                                <button className=" text-white px-2 py-2 rounded-lg mb-8 boutton" onClick={handleclick} style={{backgroundColor:"#0029FF"}}>Modifier</button>
                               </div>
                               
                </div>
            </div>:null}
    <div className='flex flex-col h-full px-10 main'>
     <Header search={handleSearchedFilm} onclick={()=>{
                setShowProfile(!showProfile);
            }}/>
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



        </div>
        <div className='flex flex-col mt-4'>
          <div className='flex items-center'>
            <p className='font-semibold text-gray-500 text-sm'>Filters:</p>
            <div className='flex flex-wrap ml-2'>
              <div className='drop relative bg-gray-800 ml-4 rounded-[20px] px-4 py-2' onClick={()=>{
                    setReverse(!reverse);}}>
                   <span className='text-white text-sm'>{annee}</span>
                  <FontAwesomeIcon
                      icon={faAngleDown}
                      className={reverse ? 'icone rotate' : 'icone'} />
                  <ul className='list -bottom-[416px] bg-gray-600' style={{display:reverse?'block':'none'}}>
                    {getYears().map((year,index)=>{
                    return(
                        <li key={index} onClick={()=>{
                            setAnnee(year);
                        }} style={{borderLeft:annee==year?'3px solid #0029FF':undefined}}>{year}</li>
                    )
                    
                   })}
                  </ul>

                </div>
                  {annee!="Année"?<button
                    onClick={()=> {setAnnee("Année");setDeletedFilter(!deletedFilter);}}
                    className="relative h-5 text-center top-[-12px]  text-white text-[12px] bg-gray-500  rounded-full px-[7px] anime"
                  >
                    &times;
                  </button>:null}
                <div className='drop relative bg-gray-800 ml-4 rounded-[20px] px-4 py-2' onClick={()=>{
                    setReverse2(!reverse2);}}>
                   <span className='text-white text-sm'>{alphabetique}</span>
                  <FontAwesomeIcon
                      icon={faAngleDown}
                      className={reverse2 ? 'icone rotate' : 'icone'} />
                  <ul className='list -bottom-22 bg-gray-600' style={{display:reverse2?'block':'none'}}>
                    {getAlphabetique().map((alpha,index)=>{
                    return(
                        <li key={index} onClick={()=>{
                            setAlphabetique(alpha);
                        }} style={{borderLeft:alphabetique==alpha?'3px solid #0029FF':undefined}}>{alpha}</li>
                    )
                    
                   })}
                  </ul>
                  </div>
                   {alphabetique!="Alphabetique"?<button
                    onClick={()=> {setAlphabetique("Alphabetique");setDeletedFilter(!deletedFilter);}}
                    className="relative h-5 text-center top-[-12px]  text-white text-[12px] bg-gray-500  rounded-full px-[7px] anime"
                  >
                    &times;
                  </button>:null}                 
                <div className='drop relative bg-gray-800 ml-4 rounded-[20px] px-4 py-2' onClick={()=>{
                    setReverse3(!reverse3);}}>
                   <span className='text-white text-sm'>{langue}</span>
                  <FontAwesomeIcon
                      icon={faAngleDown}
                      className={reverse3 ? 'icone rotate' : 'icone'} />
                  <ul className='list -bottom-22 bg-gray-600' style={{display:reverse3?'block':'none'}}>
                    <li onClick={()=>{
                        setLangue("Fr");
                    }} style={{borderLeft:langue=="Fr"?'3px solid #0029FF':undefined}}>Fr</li>
                    <li onClick={()=>{
                        setLangue("En");
                    }} style={{borderLeft:langue=="En"?'3px solid #0029FF':undefined}}>En</li>
                    </ul>
                    </div>
                   {langue!="Langue"?<button
                    onClick={()=> {setLangue("Langue");setDeletedFilter(!deletedFilter);}}
                    className="relative h-5 text-center top-[-12px]  text-white text-[12px] bg-gray-500  rounded-full px-[7px] anime"
                  >
                    &times;
                  </button>:null} 
                    {(langue!="Langue" || alphabetique!="Alphabetique" || annee!="Année")?<div>
                      <button className='ml-4 px-4 py-2 rounded-full text-sm bg-red-600 text-white anime' onClick={()=>{
                        setfiltreAppliquer(true);
                        setclick(!cliquked);
                      }}>Appliquer</button>
                    </div>:null}
            </div>
            </div>
          {/*ici je vais avec les div des filtre appliquer avec le croix */}
        </div>
          <div className="flex flex-wrap mt-4">
            {loadingFiltred || loading ? (
              <div className="flex justify-center items-center h-40 w-full">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              (() => {
                const currentList = filtreAppliquer
                  ? moviesFiltred
                  : moviesBySection[selectedSection]?.pages?.[page] ?? [];

                if (!Array.isArray(currentList) || currentList.length === 0) {
                  return (
                    <p className="text-center text-gray-400 mt-4 w-full">
                      Aucun résultat trouvé.
                    </p>
                  );
                }

                return currentList.map((film: Film | TVShow) => (
                  <Card
                    key={film.id}
                    film={film}
                    type="movie"
                    onClick={() => {
                      setClicked(film);
                      setType("movie");
                    }}
                  />
                ));

              })()
            )}
          </div>
        <div className="flex justify-center mt-4 pb-8">
            {(filtreAppliquer ? filtredpaginationRange : paginationRange).map((p, index) =>
              p === "..." ? (
                <span key={`dots-${index}`} className="px-2 py-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  className={`px-4 py-2 mx-1 rounded-full text-sm ${
                  filtreAppliquer
                    ? pageFiltred=== p? "bg-white text-black font-semibold"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                    : page === p
                    ? "bg-white text-black font-semibold"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
                  onClick={() => {
                    if(filtreAppliquer){
                        setPageFiltred(p as number);
                    }else{
                    setPage(p as number);
                    }
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
    </>
    
  );
}
export default Movie;