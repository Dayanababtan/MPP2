import './App.css'
import Home from './components/Home'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Add from './components/Add';
import Update from './components/Update'
import AddHuman from './components/AddHuman'
import UpdateHuman from './components/UpdateHuman'

function App(){
  return(
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home /> } />
          <Route path="/create" element={<Add/>}/>
          <Route path="/update" element={<Update/>}/>
          <Route path="/createHuman" element={<AddHuman/>}/>
          <Route path="/updateHuman" element={<UpdateHuman/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;