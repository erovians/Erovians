import './App.css'
import Navbar from './common/Navbar'
import { Route , Routes } from 'react-router-dom'
import Hero from './pages/Hero'

function App() {

  return (
   <>
  <Navbar/>
  <Routes>
    <Route path='/' element={<Hero/>} />
  </Routes>
   </>  
   )
}

export default App
