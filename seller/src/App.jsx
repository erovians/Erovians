import './App.css'
import Navbar from './common/Navbar'
import { Route , Routes } from 'react-router-dom'
import Hero from './pages/Hero'
import Home from './main/Home'

function App() {

  return (
   <>
  <Navbar/>
  <Routes>
    <Route path='/' element={<Home/>} />
  </Routes>
   </>  
   )
}

export default App
