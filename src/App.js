import './App.css';
import UploadPage from './components/uploadPage';
import { Routes,Route } from 'react-router-dom';
import Process from './components/process';
import MainPage from './components/mainPage';
import CreateProject from './components/createProject';
function App() {
  return (
    <div className="App">
     <Routes>
      <Route path='/upload/' element={<UploadPage/>} />
      <Route path='/dashboard/' element={<MainPage/>}  />
      <Route path='/create/' element={<CreateProject/>}/>
      <Route path='/process/' element={<Process/>} />
     </Routes>
    </div>
  );
}

export default App;
