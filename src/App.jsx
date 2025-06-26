import { useEffect, useState, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const baseURL = "https://challenge-tiler.services.propelleraero.com/tiles/";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiaW50ZXJuIiwiaWF0IjoxNzQ3OTY5OTAyfQ._nFA8un2_IMz23difs56tX4ono-oXApWk8y8YSkGkAw";

const zoomLimit = 3;
const tileSize = 256;

function App() {
  const [zoom, setZoom] = useState(0);
  const [details, setDetails] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({
    x: (window.innerWidth - tileSize) / 2,
    y: (window.innerHeight - tileSize) / 2,
  });
  const [mousePosition, setMousePosition] = useState({
    x: (window.innerWidth - tileSize) / 2 + (tileSize * 2 ** zoom) / 2,
    y: (window.innerHeight - tileSize) / 2 + (tileSize * 2 ** zoom) / 2,
  });

  const start = useRef({ x: 0, y: 0 });

  const numTiles = (z) => {
    return 2 ** z;
  };

  const mouseDown = (e) => {
    setDragging(true);
    start.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const mouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - start.current.x,
        y: e.clientY - start.current.y,
      });
    }

    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const mouseUp = () => {
    setDragging(false);
  };

  const mouseZoom = (e) => {
    let currZoom = zoom;
    if (e.deltaY < 0) {
      setZoom(Math.min(zoom + 1, zoomLimit));
      currZoom = Math.min(currZoom + 1, zoomLimit);
    } else {
      setZoom(Math.max(zoom - 1, 0));
      currZoom = Math.max(currZoom - 1, 0);
    }

    const maxTiles = numTiles(currZoom);
    setPosition({
      x: mousePosition.x - (tileSize * maxTiles) / 2,
      y: mousePosition.y - (tileSize * maxTiles) / 2,
    });
  };

  const zoomButtons = (direction) => {
    if (direction === -1) {
      setZoom(Math.max(zoom - 1, 0));
      setPosition({
        x: position.x + tileSize * 2 ** (zoom - 2),
        y: position.y + tileSize * 2 ** (zoom - 2),
      });
    } else {
      setZoom(Math.min(zoom + 1, zoomLimit));
      setPosition({
        x: position.x - tileSize * 2 ** (zoom - 1),
        y: position.y - tileSize * 2 ** (zoom - 1),
      });
    }
  };

  useEffect(() => {
    const maxTiles = numTiles(zoom);

    let images = [];
    for (let i = 0; i < maxTiles; i++) {
      for (let j = 0; j < maxTiles; j++) {
        images.push({ z: zoom, x: j, y: i });
      }
    }

    setDetails(images);
  }, [zoom]);

  return (
    <div className="">
      <div className="bg-yellow-300 fixed top-0 w-screen px-6 py-2 z-10 flex flex-row justify-between">
        <div className="font-bold"> propeller frontend coding challenge</div>
        <div>{`zoom: ${zoom} | mouse position: ${mousePosition.x}, ${mousePosition.y}`}</div>
      </div>
      <div></div>
      <div className="flex flex-col gap-2 fixed bottom-10 right-10 z-10">
        <button
          className={`bg-gray-200 font-bold shadow-md flex justify-center items-center p-2 ${
            zoom === 3 ? "" : "cursor-pointer"
          }`}
          onClick={() => zoomButtons(1)}
        >
          <FaPlus className={`${zoom === 3 ? "text-gray-300" : ""}`} />
        </button>
        <button
          className={`bg-gray-200 font-bold shadow-md flex justify-center items-center p-2 ${
            zoom === 0 ? "" : "cursor-pointer"
          }`}
          onClick={() => zoomButtons(-1)}
        >
          <FaMinus className={`${zoom === 0 ? "text-gray-300" : ""}`} />
        </button>
      </div>

      <div className="absolute top-[40px] overflow-auto">
        <div
          className="w-screen h-[calc(100vh-40px)]"
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onMouseLeave={mouseUp}
          onWheel={mouseZoom}
        >
          {details.map((tile) => {
            const tileKey = `${tile.z}${tile.x}${tile.y}`;

            return (
              <div
                key={tileKey}
                className="absolute bg-yellow-300"
                style={{
                  height: tileSize,
                  width: tileSize,
                  left: tile.x * tileSize + position.x,
                  top: tile.y * tileSize + position.y,
                }}
              >
                <img
                  crossOrigin="anonymous"
                  alt={`tile x:${tile.x} y:${tile.y}`}
                  src={baseURL + `${tile.z}/${tile.x}/${tile.y}?token=` + token}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
