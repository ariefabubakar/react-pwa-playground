
import "./App.css";
import axios from "axios";
import preval from "preval.macro";
import moment from "moment";
import Reports from "./Reports";

axios.defaults.baseURL = "https://pwa-restapi-scs.herokuapp.com";
axios.defaults.headers.common["Content-Type"] = "application/json";
// axios.defaults.baseURL = "http://localhost:5000";

function App() {
  const version = moment(preval`module.exports = new Date().getTime();`).format(
    "YY.MM.DD.HHmm"
  );

  return (
    <div className="App">
      <Reports />
      <hr class="solid" />
      <footer style={{ marginTop: 10 }}>Versi {version}</footer>
    </div>
  );
}

export default App;
