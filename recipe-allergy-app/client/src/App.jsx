
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Header from './components/Header';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;