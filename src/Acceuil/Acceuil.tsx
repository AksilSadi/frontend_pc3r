import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faTv } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import './Acceuil.css'
import Home from './Home'
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Navigate } from "react-router";
import Movie from "./movie";
function Acceuil(){
    const [naviguer, setNaviguer] = useState(false);
    const [nomPage, setNomPage] = useState("Home");
    const [refresh, setRefresh] = useState(false);
    const token=Cookies.get('token');

    if (!token) {
    return <Navigate to="/" replace={true} />;
  }
    return(
      <>
      {nomPage===""?<Navigate to="/"  replace={true} />:null}
      <div className="flex w-full h-full">
            <div className="w-[200px] h-screen shadow-[0px_-4px_10px_rgba(255,255,255,0.3),_0px_4px_10px_rgba(255,255,255,0.3)] fixed">
                        <div className=' flex pl-3 pt-8 items-center'>
                            
                            <p className='text-white text-3xl font-semibold ml-3'>MAXIL</p>
                        </div>
                        <div className='mt-20 parent
                        w-[182px] 
                        relative
                        flex
                        items-center
                        py-2 h-14
                        rounded-2xl
                        pl-3
                        item
                         ' onClick={()=>{
                            setNomPage("Home");
                            setRefresh(!refresh);
                         }}  >
                            <FontAwesomeIcon icon={faHouse} className='text-lg w-5 text-white child' />
                            <li className='list-none ml-3 child text-base text-white child'>Home</li>
                         </div>
                        <div className='mt-1 parent
                        w-[182px] 
                        relative
                        flex
                        items-center
                        py-2 h-14
                        rounded-2xl
                        pl-3
                        item
                         ' onClick={()=>{
                            setNomPage("Movie");
                            setRefresh(!refresh);
                         }} >
                            <FontAwesomeIcon icon={faFilm} className='text-lg w-5 text-white child' />
                            <li className='list-none ml-3 child text-base text-white child'>Movie</li>
                         </div>
                         <div className='mt-1 parent
                        w-[182px] 
                        relative
                        flex
                        items-center
                        py-2 h-14
                        rounded-2xl
                        pl-3
                        item
                         ' onClick={()=>{
                            setNomPage("TV");
                         }} >
                            <FontAwesomeIcon icon={faTv} className='text-lg w-5 text-white child' />
                            <li className='list-none ml-3 child text-base text-white child'>TV Show</li>
                         </div>
                         <div className='mt-1 parent
                        w-[182px] 
                        relative
                        flex
                        items-center
                        py-2 h-14
                        rounded-2xl
                        pl-3
                        item
                         '  onClick={()=>{
                            setNomPage("Favorites");
                         }}>
                            <FontAwesomeIcon icon={faHeart} className='text-lg w-5 text-white child' />
                            <li className='list-none ml-3 child text-base text-white child'>Favorites</li>
                         </div>
                         <div className='mt-1 parent
                        w-[182px] 
                        relative
                        flex
                        items-center
                        py-2 h-14
                        rounded-2xl
                        pl-3
                        item
                         '  onClick={()=>{
                            setNomPage("Top");
                         }}>
                            <FontAwesomeIcon icon={faCrown} className='text-lg w-5 text-white child' />
                            <li className='list-none ml-3 child text-base text-white child'>Top Rated</li>
                         </div>
                         <div className='flex w-[182px] bottom-4 pl-3 items-center py-2 h-14 hover:bg-white rounded-2xl parent absolute retour' onClick={()=>{
                            Cookies.remove('user');
                            Cookies.remove('token');
                            setNomPage('');
                            toast.success("Vous avez deconnecter");
                         }}>
                          <FontAwesomeIcon icon={faArrowRightFromBracket} className='text-lg w-5 text-white child' />
                          <li className='list-none ml-3 text-white text-base child '>Deconnecter</li>
                         </div>
                        </div>
                        {nomPage==='Home'?<Home page={nomPage} refresh={refresh} />:null}
                        {nomPage==='Movie'?<Movie refresh={refresh} />:null}
        </div>
      </>
    )
}
export default Acceuil;