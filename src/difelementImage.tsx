import { useState,useEffect } from 'react'
import './defiler.css'
const images = [
    '/image1.jpg',
    '/image2.jpg',
    '/image4.jpg',
    '/image5.jpg',
  ];
function Defiler(){
    const [indice, setIndice] = useState(0);
    useEffect(()=>{
        const interval = setInterval(() => {
            setIndice((prev) => (prev + 1) % images.length);
          }, 5000);
          return () => clearInterval(interval);
    },[])

    return(
        <div className="slideshow-container">
      {images.map((img, index) => (
        <div
          key={index}
          className={`slide ${index === indice ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
    </div>
    )
}
export default Defiler