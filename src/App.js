import "./App.css";
import axios from "axios";
import Reports from "./Reports";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import Header from "./Header";
import Footer from "./Footer";

axios.defaults.baseURL = "https://pwa-restapi-scs.herokuapp.com";
// axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.headers.common["Content-Type"] = "application/json";

function App() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const broadcast = new BroadcastChannel("channelQueuePost");

    broadcast.onmessage = (event) => {
      if (event.data) {
        if (event.data.type === "START") {
          enqueueSnackbar("Syncing...");
        } else if (event.data.type === "DONE") {
          enqueueSnackbar("Done Syncing");
        }
      }
    };
  }, []);

  return (
    <div className="App">
      <Header />
      <Reports />
      <Footer />
    </div>
  );
}

export default App;
