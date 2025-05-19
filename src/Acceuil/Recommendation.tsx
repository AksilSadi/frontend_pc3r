import {Film,CommentCount,TVShow,FormProps,RecommendationProps} from '../constant.ts'
import { useState,useEffect } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import './Acceuil.css';
import { Card } from './card.tsx';
import Details from './detailsmovie';
import { Navigate } from "react-router";

function Recommendation({ type, clicked, onRecommendationClick }: RecommendationProps) {
    const[recommendations,setRecommendations]=useState([]);
    const token=Cookies.get('token');
    const [clickedOne,setClicked]=useState<Film | TVShow>();
    const[typeClicked,setType]=useState("");
    const [loading,setLoading]=useState(false);

    
    useEffect(()=>{
        setLoading(true);
        if(type==="TV"){
            axios.get(`https://tmdb-database-strapi.onrender.com/api/recommendation-tv-shows?filters[id_TvShow][$eq]=${clicked.id_TvShow}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((respo)=>{
                if(respo.data){
                    const recommendations = respo.data.data[0].id_TvShow_recommendations;
                    const query = recommendations.map((id) => `filters[id_TvShow][$eq]=${id}`).join('&');
                    const url = `https://tmdb-database-strapi.onrender.com/api/Tv-shows?${query}`;
                        axios.get(url,{
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }).then((res)=>{
                            if(res.data){
                                setRecommendations(res.data.data);
                            }
                        }).catch((erreur)=>{
                            console.log(erreur)
                        })
                }
            }).catch((erreur)=>{
                console.log(erreur)
            })
        }else{
            axios.get(`https://tmdb-database-strapi.onrender.com/api/recommendation-films?filters[id_film][$eq]=${clicked.id_film}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((respo)=>{
                if(respo.data){
                    const recommendations = respo.data.data[0].id_films_recommendations;
                    const query = recommendations.map((id) => `filters[id_film][$eq]=${id}`).join('&');
                    const url = `https://tmdb-database-strapi.onrender.com/api/films?${query}`;
                    axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    }).then((res) => {
                    if (res.data) {
                        setRecommendations(res.data.data);
                    }
                    })
                }
            }).catch((erreur)=>{
                console.log(erreur)
            }).finally(()=>{
                setLoading(false);
            }
            )

        }
    },[clicked]);


  return (
    <>
    {clickedOne && typeClicked?
            <Details type={typeClicked} clicked={clickedOne} />:
    <div className="w-full flex flex-col mt-8">
    <p className='text-white font-bold text-2xl'>Recommendation</p>
    <div className='flex mt-4 flex-wrap'>
        {loading? (
                <div className="flex justify-center items-center h-40"> 
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ):
            recommendations.map((film,index)=>{
                if(film){
                    return(
                        <div className='mr-8' key={index}>
                            <Card key={index} film={film} type={type} onClick={() =>{
                           onRecommendationClick(film, film.id_TvShow?"TV":"movie");
                        } } />
                        </div>
                    )
                }
                })}
    </div>
    </div>
            }
    </>
    
  );
}
export default Recommendation;