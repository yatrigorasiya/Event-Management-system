import { useState, useEffect } from "react";

import axios from "axios";
import { Slider } from "../components/Slider";
import { Category } from "./Category";

export const Home = () => {
  const [event, setEvent] = useState([]);

  const getEvent = async (req, res) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/event/getevent`
      );
      console.log(data.event);
      setEvent(data.event);
    } catch (error) {
      console.log("Get event error", error);
    }
  };
  useEffect(() => {
    getEvent();
  }, []);

  return (
    <>
      {/* slider */}
      <div>
        <Slider />
      </div>

      {/* category section */}
      <Category />
    </>
  );
};
