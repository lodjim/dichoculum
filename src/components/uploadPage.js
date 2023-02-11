import './uploadPage.css'
import  uploadImage  from './asset/upload.svg'
import spinerImage from './asset/spiner.svg'
import doneImage from './asset/done.svg'
import croixImage from './asset/croix.svg'
import { useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
function UploadPage() {
const [formAdvancement,setFormAdvancement] = useState("none") 
const [files,setFiles] = useState(null)
const [filesName,setFilesName] = useState('')

//--------------------------------UPLOAD--------------------------------------------
async function handleUpload (){
        setFormAdvancement("progress");
        var i = 0;
        var stringified_dataStorage = localStorage.getItem('project_ids')
        var dataStorage = JSON.parse(stringified_dataStorage)
        var project_id = dataStorage[dataStorage.length-1]
        console.log(project_id)
        files.forEach(file => {

        i++;
        console.log(file)
        var formData = new FormData()
        formData.append("incoming_file",file)
        fetch(`https://f2ac-41-82-214-152.ngrok.io/upload_pdf?project_id=${project_id}`, {
                method: 'POST',
               
                body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if(data.status){
                        console.log(data)
                        if (i==files.length){
                            setFormAdvancement('done')
                        }
                    }
                    else{
                    setFormAdvancement("failed");
                    }
                })
                .catch(error => setFormAdvancement('failed'))})
;}
        
function handleUploadFileOnJS(event){
        setFiles(Array.from(event.target.files));
        setFilesName(event.target.files[0]['name']+" to "+event.target.files[Array.from(event.target.files).length-1]['name'])
}


function form(){
        if (formAdvancement==="none"){
            return(
                <div className='upload-form-container'>
            <div className='upload-form'>
                <div className='upload-form-upload'>
                <input type="file" accept="application/pdf" multiple className='upload-form-files' id="FileInput" onChange={handleUploadFileOnJS} />
                <label htmlFor="FileInput" className="custom-upload-button"><img src={uploadImage} /></label>
                <p className='upload-form-files-text'>select resume to upload (pdf)</p>
                <p className='upload-form-files-text'>{filesName}</p>
                </div>
                <div className='next-button-div'>
                    <button className='next-button' onClick={handleUpload}>
                        <p className='next-button-text'>upload</p> 
                    </button>
                </div>
            </div>
            </div>
            )
        }
        else if (formAdvancement==="progress"){
            return(
                <div className='upload-form-container'>
                    <p className='upload-state'>upload in progress</p>
                    <img className='spiner' src={spinerImage} />
                </div>
            )
        }
        else if (formAdvancement==="done"){
            return(
                <div className='upload-form-container'>
                    <p className='upload-state'>upload is done</p>
                    <img className='validate' src={doneImage} />
                    <div className='next-button-div'>
                    <Link to='/process/'>
                    <button className='next-button'>
                        <p className='next-button-text'>analyze</p> 
                    </button>
                    </Link>
                </div>
                </div>
            )
        }
        else if (formAdvancement==="failed"){
            return(
                <div className='upload-form-container'>
                    <p className='upload-state'>upload is failed</p>
                    <img className='validate' src={croixImage} />
                    <div className='next-button-div'>
                    
                </div>
                </div>
            )
        }
    }
  return (
    <div className="Content">
        <div className='upload-div'>
        <div className='upload-div-header'>
            <h1 className='upload-div-header-title'>Upload Resumes</h1>
        </div>
            {form()}
        </div>
    </div>
  );
}

export default UploadPage;