import { useEffect, useState } from 'react';
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

function Home({ page,refresh }: { page: string,refresh:boolean }): JSX.Element{
    const [films,setFilms]=useState<Film []>([]);
    const [TV,setTv]=useState<TVShow[]>([]);
    const [topFilms,setTopF]=useState<Film []>([]);
    const [topTv,setTopTv]=useState<TVShow[]>([]);
    const [comingFilms,setComingF]=useState<Film []>([]);
    const [comingTV,setComingTV]=useState<TVShow[]>([]);
    const [clickedOne,setClicked]=useState<Film | TVShow>();
    const[typeClicked,setType]=useState("");
    const { user } = useUser();
    const token=Cookies.get('token');
    const[searchTerm,setSearchTerm]=useState<string>();
    const [category,setCategory]=useState<string>();
    const [loading,setLoading]=useState(false);
    const [loadingTv,setLoadingTv]=useState(false);
    const [loadingTop,setLoadingTop]=useState(false);
    const [loadingComing,setLoadingComing]=useState(false);
    const [loadingTopTv,setLoadingTopTv]=useState(false);
    const [loadingComingTv,setLoadingComingTv]=useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const[nom,setNom]=useState(user.Nom_user);
    const[prenom,setPrenom]=useState(user.Prenom_user);
    const [dateNaissance, setDateNaissance] = useState<Date | null>(user.Date_naissance ? new Date(user.Date_naissance) : null);
    const[email,setEmail]=useState(user.email_user);
    const[password,setPassword]=useState('');
    const { setUser } = useUser();

    const handleSearchedFilm = (film: string , categorie: string) => {
        setSearchTerm(film);
        setCategory(categorie);
  };

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

    useEffect(()=>{
        setLoading(true);
        axios.get("https://tmdb-database-strapi.onrender.com/api/films?sort=popularity_tmdb:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setFilms(respo.data.data);
                }
              }).catch((erreur)=>{

              }).finally(() => {
                setLoading(false);
              }
              )
    },[refresh]);
    useEffect(()=>{
        setLoadingTv(true);
        axios.get("https://tmdb-database-strapi.onrender.com/api/Tv-shows?sort=popularity_tmdb:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setTv(respo.data.data);
                }
              }).catch((erreur)=>{

              }).finally(() => {
                setLoadingTv(false);
              }
              )
    },[refresh]);

    useEffect(()=>{
        setLoadingTop(true);
        axios.get("https://tmdb-database-strapi.onrender.com/api/films?sort=vote_average_tmdb:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setTopF(respo.data.data);
                }
              }).catch((erreur)=>{

              }).finally(() => {
                setLoadingTop(false);
              }
              )
    },[refresh]);

    useEffect(()=>{
        setLoadingTopTv(true);
        axios.get("https://tmdb-database-strapi.onrender.com/api/Tv-shows?sort=vote_average_tmdb:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setTopTv(respo.data.data);
                }
              }).catch((erreur)=>{

              }).finally(() => {
                setLoadingTopTv(false);
              }
              )
    },[refresh]);

    useEffect(()=>{
        setLoadingComing(true);
        axios.get("https://tmdb-database-strapi.onrender.com/api/films?sort=release_date:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setComingF(respo.data.data);
                }
              }).catch((erreur)=>{

              }).finally(() => {
                setLoadingComing(false);
              }
              )
    },[refresh]);

    useEffect(()=>{
        setLoadingComingTv(true);
        axios.get("https://tmdb-database-strapi.onrender.com/api/Tv-shows?sort=first_air_date:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setComingTV(respo.data.data);
                }
              }).catch((erreur)=>{

              }).finally(() => {
                setLoadingComingTv(false);
              }
              )
    },[refresh]);

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
            }
            }/>
        {clickedOne && typeClicked?
            <Details type={typeClicked} clicked={clickedOne} film={searchTerm} categorie={category} />
        
        :(searchTerm!="" && category)?
        <Searched film={searchTerm} categorie={category} />
        :<main className='flex flex-col mt-10'>
            <section className='mt-8'>

            </section>

            <section className='flex flex-col'>
                 <p className='font-bold text-white text-2xl'>Populaires</p>
                 <p className="relative text-white font-semibold mt-4 pl-4 before:content-['•'] before:absolute before:left-0 before:text-white">
                    movie
                 </p>
                    <div className='flex'>
                        {loading? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ):
                        films.map((film,index)=>{
                            return(
                            <Card key={film.id} film={film} type="movie" onClick={() =>{
                                setClicked(film);
                                setType("movie");
                            } } />
                            )
                        })}
                    </div>
                 <p className="relative text-white font-semibold mt-4 pl-4 before:content-['•'] before:absolute before:left-0 before:text-white">
                    TV Show
                 </p>
                 <div className='flex'>
                    {loadingTv? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ):
                    TV.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} type="TV" onClick={() =>{
                            setClicked(film);
                            setType("TV");
                        } } />
                        )
                    })}
                 </div>
            </section>
            <section className='flex flex-col'>
                 <p className='font-bold text-white text-2xl'>Top Rated</p>
                 <p className="relative text-white font-semibold mt-4 pl-4 before:content-['•'] before:absolute before:left-0 before:text-white">
                    movie
                 </p>
                 <div className='flex'>
                    {loadingTop? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ):
                    topFilms.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} type="movie" onClick={() =>{
                            setClicked(film);
                            setType("movie");
                        } } />
                        )
                    })}
                 </div>
                 <p className="relative text-white font-semibold mt-4 pl-4 before:content-['•'] before:absolute before:left-0 before:text-white">
                    TV Show
                 </p>
                 <div className='flex'>
                    {loadingTopTv? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ):
                    topTv.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} type="TV" onClick={() =>{
                            setClicked(film);
                            setType("TV");
                        } }  />
                        )
                    })}
                 </div>
            </section>

            <section className='flex flex-col mb-8'>
                 <p className='font-bold text-white text-2xl'>Nouveautes</p>
                 <p className="relative text-white font-semibold mt-4 pl-4 before:content-['•'] before:absolute before:left-0 before:text-white">
                    movie
                 </p>
                 <div className='flex'>
                    {loadingComing? (
                <div className="flex justify-center items-center h-40"> 
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ):
                    comingFilms.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} type="movie" onClick={() =>{
                            setClicked(film);
                            setType("movie");
                        } } />
                        )
                    })}
                 </div>
                 <p className="relative text-white font-semibold mt-4 pl-4 before:content-['•'] before:absolute before:left-0 before:text-white">
                    TV Show
                 </p>
                 <div className='flex'>
                    {loadingComingTv? (
                <div className="flex justify-center items-center h-40">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ):
                    comingTV.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} type="TV" onClick={() =>{
                            setClicked(film);
                            setType("TV");
                        } } />
                        )
                    })}
                 </div>
            </section>

        </main>}
        
        </div>
        </>
        
    )
}
export default Home;