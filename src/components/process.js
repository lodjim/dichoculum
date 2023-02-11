import React from 'react'

import { useState,useEffect } from 'react'
import './process.css'
import spinerImage from './asset/spiner-button.svg'
import doneImage from './asset/done-button.svg'
import sensImage from './asset/sens.svg'
import { useNavigate } from 'react-router-dom'
import { Mutex } from 'async-mutex'
   export default function Process() {

const [extractionAdvancement,setExtractionAdvancement] = useState('progress')
const [summaryAdvancement,setSummaryAdvancement] = useState('not')
const [embeddingsAdvancement,setEmbeddingsAdvancement] = useState('not')
const [percent,setPercent] = useState(0)
const [projectId,setProjectId] = useState(null)
const [fileIds,setFileIds] = useState(null)
const [nbFinishedTask,setnbFinishedTask] = useState([]) 

const url = "https://f2ac-41-82-214-152.ngrok.io"
const mutex = new Mutex();
function loadProjectId(){
    var stringified_dataStorage = localStorage.getItem('project_ids')
    var dataStorage = JSON.parse(stringified_dataStorage)
    var project_id_init = dataStorage[dataStorage.length-1]
    setProjectId(project_id_init)
    //getFileID();  
}

function progressBar(cursor,file_id_length){
        var new_percent = (cursor*100)/file_id_length
        setPercent(new_percent)
    }

function getFileID(){
        fetch(`${url}get_project_files?project_id=${projectId}`).then((
                function(response){
                    return response.json();
                }
            )).then((data)=>{
                if (data.status){
                    console.log(data.content.file_ids)
                    setFileIds(data.content.file_ids)
                }
            }
            )
    }

function handleExtraction(){
    var i=0;
    fileIds.forEach(fileId =>
  {
        i++
        fetch(`${url}extract_text?project_id=${projectId}&file_id=${fileId}`)
        .then(function(response) {
                return response.json();
            }).then(data => {
                console.log(data)       
                if (data.status){
                    progressBar(i,fileIds.length);
                }
                
        })
        if (i==fileIds.length){
            setExtractionAdvancement("done")
            setPercent(0)
            handleSummarization()
        }
    
    })
}

function handleEmbedding(){

    fileIds.forEach((fileId)=>{

        fetch(`${url}retrieve_summary?file_id=${fileId}`)
        .then(function(response) {
            return response.json();
        })
        .then((data)=>{
            if(data.status){
            console.log(data.content.summary) 
            fetch(`${url}compute_fingerprint`,{
                method:'POST',
                headers:{
                    "Accept":"application/json",
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    "text":data.content.summary,
                })
            })
            .then(function(response) {
                    return response.json();
            })
            .then((data)=>{
                if(data.status){
                    console.log(data)
                        }
            })
                
            }   
        }
        )
    })

}

function handleSummarization(){
    setPercent(0);
    setSummaryAdvancement('progress')
    var i=0;
    fileIds.forEach((fileId)=>{
        i++
        fetch(`${url}build_summary`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "project_id":projectId,
                "file_id":fileId
            })
        })
        .then(function(response) {
                return response.json();
            }).then(data => {
                console.log(data)
                if (data.status){
                    console.log('......')
                }
                progressBar(i,fileIds.length);
        })
        if (i==fileIds.length){
            handleMonitoring()
        }
    
    })
}


function handleMonitoring(){

    let socket = new WebSocket('ws://'+'192.168.43.52:8000/'+'realtime_monitoring')
    socket.onopen=(e)=>{
       
            fileIds.forEach((taskId)=>{
                socket.send(JSON.stringify({
                    "task_id":taskId
                }))
    
            })
        
    }
    socket.onmessage= (event)=>{
        var data = JSON.parse(event.data)
        if (data.status){
            console.log('received data',data.content.task_status,'==>',data.content.task_id)
            if(data.content.task_status=="FAILED"||data.content.task_status=="TIMEOUT"||data.content.task_status=="COMPLETED"){
                let nbFinishedTask_local = nbFinishedTask
                if (nbFinishedTask_local.length<fileIds.length){
                    nbFinishedTask_local.push(1);
                    setnbFinishedTask(nbFinishedTask_local)
                    console.log(nbFinishedTask_local.length,'-----',fileIds.length, data.content.task_id)    
                    progressBar(nbFinishedTask_local.length,fileIds.length)
                    if(nbFinishedTask_local.length == fileIds.length){
                        socket.close()
                        setSummaryAdvancement("done")
                        console.log('connection is closed')
                        handleEmbedding();
                    }

                }
                
            }
            else{
                socket.send(JSON.stringify({
                    "task_id":data.content.task_id 
                }))
            }
        }
    }

}

//-----------------------------UseState Zone---------------------




useEffect(()=>{
    loadProjectId(); 
},[])
useEffect(()=>{
    console.log('project id has change')
    if (projectId!=null){
        console.log("project id was set")
        getFileID()
    }
},[projectId])


useEffect(()=>{
if(fileIds!=null){
    console.log('extraction was called')
    handleExtraction()
}
},[fileIds])



function extractionDiv(){
        if (extractionAdvancement=='progress') {
            return(
                <div className='process-not-finish'>
                    <p className='process-text'>extraction</p><img src={spinerImage} className="spiner-button"/>
                </div>
            )
        }
        else if (extractionAdvancement=='done'){
            return(
                <div className='process-finish'>
                    <p className='process-text'>extraction</p><img src={doneImage} className="validate" />
                </div>
            )
        }
        else{
            return(
                <div className='process-not-start'>
                    <p className='process-text'>extraction</p>
                </div>
            )
        }
    }

    function summaryDiv(){

        if (summaryAdvancement=='progress') {
            return(
                <div className='process-not-finish'>
                    <p className='process-text'>summary</p><img src={spinerImage} className="spiner-button"/>
                </div>
            )
        }
        else if (summaryAdvancement=='done'){
            return(
                <div className='process-finish'>
                    <p className='process-text'>summary</p><img src={doneImage} className="validate" />
                </div>
            )
        }
        else{
            return(
                <div className='process-not-start'>
                    <p className='process-text'>summary</p>
                </div>
            )
        }
    }

    function embeddingsDiv(){
    
         if (embeddingsAdvancement=='progress') {
            return(
                <div className='process-not-finish'>
                    <p className='process-text'>embeddings</p><img src={spinerImage} className="spiner-button"/>
                </div>
            )
        }
        else if (embeddingsAdvancement=='done'){
            return(
                <div className='process-finish'>
                    <p className='process-text'>embeddings</p><img src={doneImage} className="validate" />
                </div>
            )
        }
        else{
 
                return(
                    <div className='process-not-start'>
                        <p className='process-text'>embeddings</p>
                    </div>
                )

        }
    }

  return (

    <div className='Content-process'>
        <h1 className='advancement'>background progress....</h1>
        <div className='progressbar'><div className='progressbar-state' style={{width:`${percent}%`}}></div></div>
        <div className='pipeline'>
          {extractionDiv()}
          <img src={sensImage} />
          {summaryDiv()}
          <img src={sensImage} />
          {embeddingsDiv()}
        </div>
    </div>
  
  )
}
