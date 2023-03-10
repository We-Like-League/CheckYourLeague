import {useState} from 'react';
import {Link} from  "react-router-dom";
import './home.css';

function Home() {

  const [name, setName] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  }

  const handleButtonClick = (e) => {
    console.log(name);
  }

  return (
    <div className="wrapper">
      <div className="mainComponent">
          <form>
            <label className="nameLabel">Search</label>
            <input type="text" value={name} onChange={handleNameChange} placeholder="Enter Summoner Name"></input>
          </form>
        <Link to="/page" state={name} style={{textDecoration:"none"}}>
          <button className="searchButton">Go</button>
        </Link>
      </div>
    </div>
  )
};

export default Home;

