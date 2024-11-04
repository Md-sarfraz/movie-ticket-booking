import './assets/style.css'
import {Route, Routes} from 'react-router-dom';
import Home from './views/home';
import About from './views/about';
import LoginPage from './views/loginPage';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Contact from './views/contact';
import SignUpPage from './views/signUpPage';


function App() {
  return(
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/loginPage' element={<LoginPage/>}/>
        <Route path='/signUpPage' element={<SignUpPage/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
