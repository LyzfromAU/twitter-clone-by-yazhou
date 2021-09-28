import './App.css';
import Sidebar from './Sidebar';
import Feed from './Feed';
import Widget from './Widget';
import { useSelector } from 'react-redux';
import Login from './Login';


function App() {
  const user = useSelector(state=>state.user);
  return (
    <>
    {user.isLoggedIn?<div className="app">
      <Sidebar />
      <Feed />
      <Widget />   
    </div>:<Login />}
    </>
  );
};

export default App;
