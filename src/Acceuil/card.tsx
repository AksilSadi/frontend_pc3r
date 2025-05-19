import {Film,TVShow} from '../constant.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar,faComment,faHeart } from '@fortawesome/free-solid-svg-icons'
import { useEffect,useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
type FilmCardProps = {
  film: Film  | TVShow;
  type:string;
   onClick: () => void;
};


export const Card = ({ film,type,onClick }: FilmCardProps) =>{
  const [likes, setLikes] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const token=Cookies.get('token');
  const displayTitle = type === 'movie'
  ? (film as Film).title
  : (film as TVShow).Name;
  const displayDate = type === 'movie'
  ? (film as Film).release_date
  : (film as TVShow).first_air_date;
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        let id: string | undefined;
      if (type === "movie" && "id_film" in film) {
        id = film.id_film;
      } else if (type === "TV" && "id_TvShow" in film) {
        id = film.id_TvShow;
      } else {
        throw new Error("Type ou propriétés inconnues");
      }
        const response = await axios.get(`https://tmdb-database-strapi.onrender.com/api/Favorites?filters[id_media_type][$eq]=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.data.length > 0) {
        const likeCount = response.data.meta.pagination.total;
        setLikes(likeCount);
      }
    }catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchLikes();
  }, [film]);

  useEffect(() => {
    const idfilm=film.id;
    axios.get(
            `https://tmdb-database-strapi.onrender.com/api/commentaires?filters[id_media_type][$eq]=${idfilm}&pagination[pageSize]=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
          ).then((respo) => {
            if(respo.data){
                setCommentCount(respo.data.meta.pagination.total);
            }
          }
          ).catch((erreur)=>{
            console.error('Error fetching comment count:', erreur);
          }
          )
  }, [film]);

  return(
  <div onClick={onClick} key={film.id} className="flex flex-col rounded-lg w-56 mr-6 px-2 py-2">
    <img
      src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
      className="w-full h-80 object-cover rounded-lg anime"
    />
    <p className="text-white text-center mt-1">{displayTitle}</p>
    <div className="flex justify-between items-center mt-1">
      <p className="text-gray-300 text-xs">{displayDate}</p>
      <div className="flex items-center">
        <div className="flex mr-2">
          <FontAwesomeIcon icon={faStar} className="text-lg w-3 text-green-400" />
          <li className="list-none ml-1 text-base text-white text-[12px]">{film.vote_average_website}</li>
        </div>
        <div className="flex mr-2">
          <FontAwesomeIcon icon={faHeart} className="text-lg w-3 text-red-600" />
          <li className="list-none ml-1 text-base text-white text-[12px]">{`${likes}`}</li>
        </div>
        <div className="flex mr-2">
          <FontAwesomeIcon icon={faComment} className="text-lg w-3 text-white" />
          <li className="list-none ml-1 text-base text-white text-[12px]">{commentCount}</li>
        </div>
        <FontAwesomeIcon icon={faStar} className="text-lg w-3 text-yellow-300" />
        <li className="list-none ml-1 text-base text-yellow-300 text-[12px]">
          {film.vote_average_tmdb}
        </li>
      </div>
    </div>
  </div>
);
} 