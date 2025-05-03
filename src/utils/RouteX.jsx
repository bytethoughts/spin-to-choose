import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SpinWheel from '../pages/SpinWheel'
import Terms from '../pages/Terms'
 import Privacy from '../pages/Privacy'
import RandomNumber from '../pages/RandomNumber'
import RandomAlphabet from '../pages/RandomAlphabet'
import NFLTeamPicker from '../pages/NFLTeamPicker'

function RouteX() {
  return (
    <Routes>
      <Route path='/' element={<SpinWheel />} />
      <Route path='/random-number' element={<RandomNumber />} />
      <Route path='/random-alphabet' element={<RandomAlphabet />} />
      <Route path='/nfl-team-picker' element={<NFLTeamPicker />} />
      <Route path='/terms-of-service' element={<Terms />} />
      <Route path='/privacy-policy' element={<Privacy />} />
     </Routes>
  )
}

export default RouteX