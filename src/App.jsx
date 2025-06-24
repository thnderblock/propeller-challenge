import { useEffect, useState } from "react";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiaW50ZXJuIiwiaWF0IjoxNzQ3OTY5OTAyfQ._nFA8un2_IMz23difs56tX4ono-oXApWk8y8YSkGkAw";

const zoomLimit = 3;

function App() {
  const [zoom, setZoom] = useState(0);
  const [image, setImage] = useState([]);

  useEffect(() => {
    console.log(zoom);
    setImage([]);

    for (let i = 0; i < 2 ** zoom; i++) {
      let temp = [];
      for (let j = 0; j < 2 ** zoom; j++) {
        temp.push(
          `https://challenge-tiler.services.propelleraero.com/tiles/${zoom}/${j}/${i}?token=` +
            token
        );
      }
      setImage((prev) => [...prev, temp]);
    }
  }, [zoom]);

  return (
    <>
      <div className="bg-yellow-300 font-bold fixed top-0 w-screen p-2">
        propeller frontend coding challenge{" "}
        <span className="italic">nicholas tong</span>
      </div>
      <div className="flex flex-col gap-2 fixed bottom-10 right-10">
        <button
          className="bg-gray-100 font-bold border-2 flex justify-center items-center px-2 cursor-pointer"
          onClick={() => setZoom(zoom == zoomLimit ? zoomLimit : zoom + 1)}
        >
          +
        </button>
        <button
          className="bg-gray-100 font-bold border-2 flex justify-center items-center px-2 cursor-pointer"
          onClick={() => setZoom(zoom == 0 ? 0 : zoom - 1)}
        >
          -
        </button>
      </div>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        {image.map((url, i) => (
          <div key={i} className="flex flex-row">
            {url.map((url, j) => (
              <img crossOrigin="anonymous" key={j} src={url} alt="tile" />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
