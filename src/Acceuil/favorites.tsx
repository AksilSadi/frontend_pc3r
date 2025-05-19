import { use, useEffect, useState } from 'react';
import './Acceuil.css'
import axios from "axios";
import {Film,CommentCount,TVShow} from '../constant.ts'
import { Card } from './card.tsx';
import { Navigate } from "react-router";
import Cookies from 'js-cookie';
import { useUser } from '../Context/UserContext';
import Details from './detailsmovie'
import Header from './header.tsx';
import Searched from './Searched.tsx';
import DatePicker from "react-datepicker";
import toast from 'react-hot-toast';
function Favorites({ refresh }: { refresh:boolean }) {
    const [films,setFilms]=useState({});
    const [page, setPage] = useState(1);
    const [totalPages,setTotal] = useState(Math.ceil(films?.page) || 1);
    const [clickedOne,setClicked]=useState<Film | TVShow>();
    const[typeClicked,setType]=useState("");
    const token=Cookies.get('token');
    const[searchTerm,setSearchTerm]=useState<string>();
    const [category,setCategory]=useState<string>();
    const[loading,setLoading]=useState(false);
    const [showProfile, setShowProfile] = useState(false);
        const { user } = useUser();
            const[nom,setNom]=useState(user.Nom_user);
            const[prenom,setPrenom]=useState(user.Prenom_user);
            const [dateNaissance, setDateNaissance] = useState<Date | null>(user.Date_naissance ? new Date(user.Date_naissance) : null);
            const[email,setEmail]=useState(user.email_user);
            const[password,setPassword]=useState('');
            const { setUser } = useUser();
    
            const handleclick=()=>{
            const data = {
                Nom_user: nom,
                Prenom_user: prenom,
                Date_naissance: dateNaissance,
                email: email
            };
            axios.put(`https://tmdb-database-strapi.onrender.com/api/users/${user.id}`,data, {
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
                setNom(user.Nom_user);
                setPrenom(user.Prenom_user);
                setDateNaissance(user.Date_naissance ? new Date(user.Date_naissance) : null);
                setEmail(user.email_user);
                setPassword('');
            });
        }

    const handleSearchedFilm = (film: string , categorie: string) => {
        setSearchTerm(film);
        setCategory(categorie);
  };

      useEffect(()=>{
        setClicked(undefined);
        setType("");
        setSearchTerm("");
        setCategory("");
    },[refresh]);

useEffect(() => {
    setLoading(true);
    axios.get(`https://tmdb-database-strapi.onrender.com/api/favorites?filters[id_user][$eq]=${user.id}&pagination[page]=${page}&pagination[pageSize]=15`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(async (res) => {
        const { data, meta } = res.data;
        setTotal(meta.pagination.pageCount);
        // Filtrage des IDs
        const filmIds = data.filter((item) => item.media_type==="movie").map((item) => item.id_media_type);
        const tvIds = data.filter((item) => item.media_type==="TV").map((item) => item.id_media_type);

        // Génération des URL
        const movieQuery = filmIds.map((id) => `filters[id_film][$eq]=${id}`).join('&');
        const tvQuery = tvIds.map((id) => `filters[id_TvShow][$eq]=${id}`).join('&');

        const moviePromise = filmIds.length
            ? axios.get(`https://tmdb-database-strapi.onrender.com/api/films?${movieQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            : Promise.resolve({ data: { data: [] } });

            console.log(moviePromise);

        const tvPromise = tvIds.length
            ? axios.get(`https://tmdb-database-strapi.onrender.com/api/Tv-shows?${tvQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            : Promise.resolve({ data: { data: [] } });

        const [moviesRes, tvRes] = await Promise.all([moviePromise, tvPromise]);

        const combined = [...moviesRes.data.data, ...tvRes.data.data];

        setFilms((prev) => ({
            ...prev,
            [page]: combined
        }));
    }).catch((err) => {
        console.error(err);
    }).finally(() => {
        setLoading(false);
    });
}, [page]);

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
                                    <input type="password"  className="pl-1 mt-1 h-10 rounded-lg bg-transparent border-2 border-solid  border-white outline-none focus:border-4 text-white placeholder:text-gray-300"  placeholder="************" onChange={(e)=>{
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
        {user===undefined?<Navigate to="/"  replace={true} />:null /*pour savoir si le cookie est experi ou non */ }
        <div className='flex flex-col h-full px-10 main'>
            <Header search={handleSearchedFilm} onclick={()=>{
                setShowProfile(!showProfile);
            }}/>
        {clickedOne && typeClicked?
            <Details type={typeClicked} clicked={clickedOne} film={searchTerm} categorie={category} />
        
        :(searchTerm!="" && category)?
        <Searched film={searchTerm} categorie={category} />
        :<main className='flex flex-col mt-10'>
            <section className='mt-8'>

            </section>

            <section className='flex flex-col'>
                <h1 className="text-2xl font-bold mb-4 mt-4 text-white">Mes Favoris</h1>
                {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {films[page]?.map((film: Film | TVShow) => (
                        <Card
                            key={film.id}
                            film={film}
                            type={film.id_TvShow ? "TV" : "movie"}
                            onClick={() => {
                                setClicked(film);
                                setType(film.id_TvShow ? "TV" : "movie");
                            }}
                        />
                    ))}
                </div>
            )}

                <div className="flex justify-center mt-4 pb-8">
            { paginationRange.map((p, index) =>
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
            </section>
            
        </main>}
        
        </div>
        </>
  );
}

export default Favorites;