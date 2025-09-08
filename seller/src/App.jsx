import './App.css'
import Navbar from './common/Navbar'
import { Route , Routes } from 'react-router-dom'
import Hero from './components/Hero'
import Home from './pages/Home'
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
