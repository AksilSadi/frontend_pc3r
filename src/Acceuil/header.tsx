import image from '../assets/download.png'
import { useUser } from '../Context/UserContext';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass,faAngleDown } from '@fortawesome/free-solid-svg-icons'
import './Acceuil.css'
import '../login.css';
function Header({search,onclick}:{search:(film:string,categorie:string)=>void,onclick:() => void}):JSX.Element {
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setLocalCategory] = useState("Film");
    const [reverse,setReverse]=useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            search(searchTerm,category);
        }
        setSearchTerm('');
    };

  return (
    <header className="flex justify-between items-center  mt-8 h-fit">
                <div className="">
                    <p className="text-2xl font-bold text-white">Recherche</p>
                </div>

                <div className="flex items-center">
                  <div className='search h-8 flex items-center bg-gray-600 px-5 py-5 search'>
                    <form onSubmit={handleSubmit} className='search h-8 flex items-center bg-gray-600 px-3 py-5'>
                      <input 
                        type='search' 
                        placeholder='Chercher des films, tvshows, ... par son titre' 
                        className='text-white w-[400px] bg-transparent outline-none' 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button type="submit" className=' text-black ml-2'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </button>
                    </form>
                    </div>
                    <div className='drop relative bg-gray-600 ml-4 rounded-[20px] px-4 py-2' onClick={()=>{
                                setReverse(!reverse);
                            }}>
                                <span className='text-gray-300'>{category}</span>
                                <FontAwesomeIcon
                                 icon={faAngleDown}
                                 className={reverse ? 'icone rotate' : 'icone'} />
                                 <ul className='list -bottom-22 bg-gray-600' style={{display:reverse?'block':'none'}}>
                                    <li onClick={()=>{
                                        setLocalCategory("Film");
                                    }} style={{borderLeft:category=='Film'?'3px solid #FFFFFF':undefined}}>Film</li>
                                    <li onClick={()=>{
                                        setLocalCategory("TV");
                                    }} style={{borderLeft:category=='TV'?'3px solid #FFFFFF':undefined}}>TV Show</li>
                                 </ul>
                            </div>

                  </div>

                <div className="flex items-center hover:cursor-pointer" onClick={onclick}>
                <img src={image} className="h-10 w-10 rounded-full"></img>
                <div className="flex flex-col justify-center ml-2">
                    <p className='font-semibold text-white'>{`${user?.Nom_user} ${user?.Prenom_user}`}</p>
                </div>
                </div>
        </header>
  );
}
export default Header;