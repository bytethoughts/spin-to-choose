import React from 'react'
import RouteX from './utils/RouteX'
import CustomNavbar from './components/CustomNavbar'
import Footer from './components/Footer'
function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <CustomNavbar />
          <div className='flex-0'>
             <RouteX /> 
          </div>
          <Footer />
    </div>
  )
}

export default App