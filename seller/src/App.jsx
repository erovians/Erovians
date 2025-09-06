import './App.css'
import Navbar from './common/Navbar'
import { Route , Routes } from 'react-router-dom'
import Hero from './pages/Hero'
import Home from './main/Home'
import Footer from '@/common/Footer'
function App() {

  return (
   <>
  <Navbar/>
  <Routes>
    <Route path='/' element={<Home/>} />
  </Routes>
     <Footer/>
   </>  
   )
}

export default App
