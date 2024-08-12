import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ReadUser from './components/ReadUser';
import UpdateUser from './components/UpdateUser';



function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/readuser/:id" element={<ReadUser/>}/>
          <Route path="/updateuser/:id" element={<UpdateUser/>}/>
        </Routes>
      </div>
       
    </>
  )
}

export default App

