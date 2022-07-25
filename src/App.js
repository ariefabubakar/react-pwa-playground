import { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import preval from "preval.macro";
import moment from "moment";

axios.defaults.baseURL = "https://pwa-restapi-scs.herokuapp.com";

function App() {
  const [message, setMessage] = useState("");
  const version = moment(preval`module.exports = new Date().getTime();`).format(
    "YY.MM.DD.HHmm"
  );

  useEffect(() => {
    axios.get('/api/test').then(function (response) {
      // handle success
      setMessage(response.data.message);
    });
  });

  return (
    <div>
      <div>
    {message}
    </div>
    <footer>
      Versi {version}
      </footer>
    </div>
  );
}

export default App;
