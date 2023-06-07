import React, { useEffect, useRef, useState } from "react";

const slideImages = [
  {
    url: "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    caption: "Slide 1",
  },
  {
    url: "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    caption: "Slide 2",
  },
  {
    url: "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    caption: "Slide 3",
  },
];
const delay = 5000;

const ScreenSaver = (props) => {
  const { stay, images } = props;
  const [imagesBanners, setImagesBanners] = useState(images);
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }
  function setisStay() {
    stay();
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === imagesBanners.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);
  return (
    <div
      className="whitespace-nowrap transition ease-linear duration-500"
      style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      onClick={() => setisStay()}
    >
      {imagesBanners.map((image, index) => (
        <div className="inline-block h-screen w-full" key={index}>
          <img src={image.banner_url} alt="" className="-full h-full" />
        </div>
      ))}
    </div>
  );
};
export default ScreenSaver;
