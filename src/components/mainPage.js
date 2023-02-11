import React from 'react'
import './mainPage.css'
import { useEffect,useState } from 'react'
import profilImage from './asset/profil.svg'
import searchImage from './asset/search.svg'
import skillsImage from './asset/skills.svg'
import likeImage from './asset/like.svg'
export default function MainPage() {
  const [summaries,setSummaries] = useState([])
  useEffect(()=>{
    var storageData = localStorage.getItem('data')
    storageData = JSON.parse(storageData)
    var files_ids = storageData.file_id
    var summary = storageData.summary
    setSummaries(summary)
  },[])
  return (
    <div className='Content-mainPage'>
      <header>
      <div className='logo-div'> <p className='logo-text'>LOGO</p></div>
      <nav><a className='nav-par-active'>home</a> <a className='nav-par'>liked resumes</a><a className='nav-par'>settings</a></nav>
      <div className='profil-div'> <p className='user-name'>Ba,Ibrahima</p> <div className='circle-shadow'><img src={profilImage}/></div> </div>
      </header>
      <div className='search-div'>
        <div className='input-div'>
          <img className='search-image' src={searchImage} />
        <input type='text' className='search-field' placeholder='search....' />
        </div>
      </div>
      <div className='result-div'>
      <div className='items' >
      {summaries.slice(0,15).map(item => (


<div className='card-item'>
  <div className='card-item-header'>
  <div className='circle'><img src={profilImage}/></div>
  <p className='card-item-name'>Djim Momar Lo</p>
  </div>
  <div className='card-content'>
    <div className='card-content-left'>
      <p className='summary-resume'>
        {item.slice(0,212)}....
      </p>
      <div className='skills-title-div'>
        <img src={skillsImage}/><p className='skills-title'>Skills</p>
      </div>
      <p className='skills-text'>Python, Javascript, C</p>
    </div> 
    <div className='card-content-right'>
        <button className='like-button'>
            <img src={likeImage}/>
        </button>
    </div>
  </div>
</div>


      ))}
        </div>
      </div>
    </div>
  )
}
