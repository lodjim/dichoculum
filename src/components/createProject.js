import React from 'react'
import './createProject.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function CreateProject() {
    
    const [projectName,setProjectName] = useState(null)
    const [projectDomaine,setProjectDomaine] = useState(null)
    const [projectDescriptions,setProjectDescriptions] = useState(null)
    const navigate = useNavigate();
    function handleNameChange(event){
        setProjectName(event.target.value);
    }  

    function handleDomaineChange(event){
        setProjectDomaine(event.target.value)
    }
    function handleDescriptionChange(event){
        setProjectDescriptions(event.target.value)
    }

    function handleClick(){

        localStorage.setItem('project_ids','[]')
        if (projectName!=null && projectDomaine!=null && projectDescriptions!=null){
            fetch('https://f2ac-41-82-214-152.ngrok.io/create_project',{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                "project_name": projectName,
                "project_domain": projectDomaine,
                "project_description": projectDescriptions
            })
            }).then((response)=> {
                return response.json()})
                .then((data)=>{
                    console.log(data)
                    if (data.status){
                        var project_id = data.content.project_id
                        var stringified_dataStorage = localStorage.getItem('project_ids')
                        var dataStorage = JSON.parse(stringified_dataStorage)
                        dataStorage.push(project_id)
                        localStorage.setItem('project_ids',JSON.stringify(dataStorage))
                        navigate("/upload/")
                    }
            })
        }
    }

    return (
    <div className="Content">
    <div className='upload-div'>
    <div className='upload-div-header'>
        <h1 className='upload-div-header-title'>Project creation</h1>
    </div>
    <div className='upload-form-container'>
            <div className='upload-form'>
                <h2 className='upload-form-label'>Project Name</h2>
                <input type="text" className='form-project-name' placeholder='the name of this projet...' onChange={handleNameChange}/>
                <h2 className='upload-form-label'>Project Domaine</h2>
                <input type="text" className='form-project-name' placeholder='the domaine of the projet...' onChange={handleDomaineChange} />
                <h2 className='upload-form-label'>Descriptions</h2>
                <textarea className='upload-form-description' placeholder='Job description....' onChange={handleDescriptionChange}></textarea>
                <div className='next-button-div'>
                    <button className='next-button' onClick={handleClick}>
                        <p className='next-button-text'>create</p> 
                    </button>
                </div>
            </div>
    </div>
    </div>
</div>
  )
}
