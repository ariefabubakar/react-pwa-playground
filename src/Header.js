import { useEffect, useState } from "react";

function Header(props) {
  const [online, setOnline] = useState(navigator.onLine);
  const [pending, setPending] = useState(0);

  function getQueuesMeta() {
    return new Promise((resolve) => {
      const connection = indexedDB.open("workbox-background-sync");
      const res = [];

      connection.onsuccess = (event) => {
        const db = event.target.result;

        try {
          const tx = db.transaction(["requests"]);
          const reqIndex = tx.objectStore("requests").index("queueName");

          reqIndex.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;
            let meta = {};
            if (cursor) {
              meta = {
                // if you got meta, time to get it
                timestamp: cursor.value.timestamp,
              };
              if ("undefined" == typeof res[cursor.key]) {
                res[cursor.key] = [meta];
              } else {
                res[cursor.key].push(meta);
              }
              cursor.continue();
            } else {
              resolve(res);
            }
          };
        } catch (error) {
          console.log("no ‘request’ objectStore");
          resolve(null);
        }
      };
    });
  }

  const updatePending = () => {
    console.log("1");
    getQueuesMeta().then((meta) => {
      console.log(meta);
      if (meta.queuePost) {
        setPending(meta.queuePost.length);
      } else {
        setPending(0);
      }
    });
  };

  useEffect(() => {
    window.addEventListener("offline", () => {
      updatePending();
      setOnline(false);
    });

    window.addEventListener("online", () => {
      setPending(0);
      setOnline(true);
    });
  }, []);

  return (
    <header>
      <h1>
        PWA (
        {online ? (
          "ONLINE"
        ) : (
          <span style={{ color: "red" }}>
            OFFLINE{pending === 0 ? "" : ` : ${pending} requests pending`}
          </span>
        )}
        )
      </h1>
    </header>
  );
}

export default Header;
