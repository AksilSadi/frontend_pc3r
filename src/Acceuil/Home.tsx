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

function Home({ page,refresh }: { page: string,refresh:boolean }): JSX.Element{
    const [films,setFilms]=useState<Film []>([]);
    const [TV,setTv]=useState<TVShow[]>([]);
    const [topFilms,setTopF]=useState<Film []>([]);
    const [topTv,setTopTv]=useState<TVShow[]>([]);
    const [comingFilms,setComingF]=useState<Film []>([]);
    const [comingTV,setComingTV]=useState<TVShow[]>([]);
    const [commentCounts, setCommentCounts] = useState<CommentCount>({});
    const [clickedOne,setClicked]=useState<Film | TVShow>();
    const[typeClicked,setType]=useState("");
    const { user } = useUser();
    const token=Cookies.get('token');
    const[searchTerm,setSearchTerm]=useState<string>();
    const [category,setCategory]=useState<string>();

    const handleSearchedFilm = (film: string , categorie: string) => {
        setSearchTerm(film);
        setCategory(categorie);
  };

    useEffect(()=>{
        axios.get("https://tmdb-database-strapi.onrender.com/api/films?sort=popularity_tmdb:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setFilms(respo.data.data);
                }
              }).catch((erreur)=>{

              })
    },[]);
    useEffect(()=>{
        axios.get("https://tmdb-database-strapi.onrender.com/api/Tv-shows?sort=popularity_tmdb:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setTv(respo.data.data);
                }
              }).catch((erreur)=>{

              })
    },[]);

    useEffect(()=>{
        axios.get("https://tmdb-database-strapi.onrender.com/api/films?sort=vote_average_tmdb:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setTopF(respo.data.data);
                }
              }).catch((erreur)=>{

              })
    },[]);

    useEffect(()=>{
        axios.get("https://tmdb-database-strapi.onrender.com/api/Tv-shows?sort=vote_average_tmdb:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setTopTv(respo.data.data);
                }
              }).catch((erreur)=>{

              })
    },[]);

    useEffect(()=>{
        axios.get("https://tmdb-database-strapi.onrender.com/api/films?sort=release_date:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setComingF(respo.data.data);
                }
              }).catch((erreur)=>{

              })
    },[]);

    useEffect(()=>{
        axios.get("https://tmdb-database-strapi.onrender.com/api/Tv-shows?sort=first_air_date:desc&pagination[page]=1&pagination[pageSize]=5", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }).then((respo) => {
                if(respo.data){
                    setComingTV(respo.data.data);
                }
              }).catch((erreur)=>{

              })
    },[]);

    useEffect(()=>{
        setClicked(undefined);
        setType("");
        setSearchTerm("");
        setCategory("");
    },[refresh]);


    useEffect(() => {
        //calculer le nombre de commentaire
    const fetchCommentCounts = async () => {
      const counts: CommentCount = {}

      await Promise.all(
        films.map(async (film) => {
          const idfilm=parseInt(film.id)
          const res = await axios.get(
            `https://tmdb-database-strapi.onrender.com/api/commentaires?filters[id_media_type][$eq]=${idfilm}&pagination[pageSize]=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
          )
          counts[film.id_film] = res.data.meta.pagination.total
          
        })
      )

      setCommentCounts(counts)
    }

    fetchCommentCounts()
  }, [films,refresh]);



    return (
        <>
        {user===undefined?<Navigate to="/"  replace={true} />:null /*pour savoir si le cookie est experi ou non */ }
        <div className='flex flex-col h-full px-10 main'>
            <Header search={handleSearchedFilm}/>
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
                    {films.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} commentCount={commentCounts[film.id_film]} type="movie" onClick={() =>{
                            setClicked(film);
                            setType("movie");
                        } }  />
                        )
                    })}
                 </div>
                 <p className="relative text-white font-semibold mt-4 pl-4 before:content-['•'] before:absolute before:left-0 before:text-white">
                    TV Show
                 </p>
                 <div className='flex'>
                    {TV.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} commentCount={commentCounts[film.id_TvShow] } type="TV" onClick={() =>{
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
                    {topFilms.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} commentCount={commentCounts[film.id_film]} type="movie" onClick={() =>{
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
                    {topTv.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} commentCount={commentCounts[film.id_TvShow] } type="TV" onClick={() =>{
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
                    {comingFilms.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} commentCount={commentCounts[film.id_film]} type="movie" onClick={() =>{
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
                    {comingTV.map((film,index)=>{
                        return(
                        <Card key={film.id} film={film} commentCount={commentCounts[film.id_TvShow] } type="TV" onClick={() =>{
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