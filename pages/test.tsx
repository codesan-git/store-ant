import { useEffect, useState } from "react";
import { IoMdPin } from "react-icons/io";

export default function App() {
  // const [globalCoords, setGlobalCoords] = useState({x: 0, y: 0});
  const [localCoords, setLocalCoords] = useState({ x: 0, y: 0 });
  const [pinLocation, setPinLocation] = useState("");

  const handleMouseClick = (event: any) => {
    // 👇️ Get the mouse position relative to the element
    const target = event.target as HTMLInputElement;
    setLocalCoords({
      x: event.clientX - target?.offsetLeft,
      y: event.clientY - target?.offsetTop,
    });
  };

  // useEffect(() => {
  //   const handleGlobalMouseMove = event => {
  //     setGlobalCoords({
  //       x: event.clientX,
  //       y: event.clientY,
  //     });
  //   };
  //   window.addEventListener('mousemove', handleGlobalMouseMove);

  //   return () => {
  //     window.removeEventListener(
  //       'mousemove',
  //       handleGlobalMouseMove,
  //     );
  //   };
  // }, []);

  return (
    <div>
      <div
        onClick={handleMouseClick}
        style={{
          padding: "4rem",
          backgroundColor: "lightgray",
          border: "1px solid black",
          width: "500px",
        }}
      >
        <h2>
          Relative: ({localCoords.x}, {localCoords.y})
        </h2>
      </div>

      <br />

      <div className="relative">
        <div className="flex justify-center">
          {pinLocation === "location1" ? (
            <button className="absolute mr-36 mt-10 cursor-pointer">
              <IoMdPin
                style={{ color: "blue" }}
                onClick={() => setPinLocation("")}
              />
            </button>
          ) : (
            <button className="absolute mr-36 mt-10 cursor-pointer">
              <IoMdPin
                style={{ color: "red" }}
                onClick={() => setPinLocation("location1")}
              />
            </button>
          )}
        </div>
        <div className="flex justify-center">
          {pinLocation === "location2" ? (
            <button className="absolute ml-60 mt-10 cursor-pointer">
              <IoMdPin
                style={{ color: "blue" }}
                onClick={() => setPinLocation("")}
              />
            </button>
          ) : (
            <button className="absolute ml-60 mt-10 cursor-pointer">
              <IoMdPin
                style={{ color: "red" }}
                onClick={() => setPinLocation("location2")}
              />
            </button>
          )}
        </div>
        <img
          src="https://cdn.discordapp.com/attachments/1075964120991539250/1108246099023630477/png-transparent-studio-apartment-house-floor-plan-apartment-building-apartment-plan.png"
          alt="map"
          onClick={handleMouseClick}
          className="w-96 h-96 bg-cover m-auto"
        />
      </div>
    </div>
  );
}
