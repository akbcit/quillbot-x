import React, { useState } from 'react';
import Typewriter from 'typewriter-effect';
import "../styles/typeWriterText.styles.scss";
import rocketImage from "../assets/rocket-dynamic-color.png";
import botImage from "../assets/bot.png";

interface Message {
  img: string;
  text: string;
  alt: string;
}

// Approximating the type for the typewriter instance
interface TypewriterInstance {
  typeString: (text: string) => TypewriterInstance;
  pauseFor: (ms: number) => TypewriterInstance;
  deleteAll: () => TypewriterInstance;
  callFunction: (fn: () => void) => TypewriterInstance;
  start: () => void;
}

const TypeWriterTitle: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string>(rocketImage);

  const messages: Message[] = [
    { img: rocketImage, text: "Turbocharge Your Creativity", alt: "rocket" },
    { img: botImage, text: "AI Powered Insights", alt: "bot" },
  ];

  return (
    <div className="typewriter-container">
      <img src={currentImage} alt={messages.find(msg => msg.img === currentImage)?.alt} />
      <div className="typewriter-text">
        <Typewriter
          options={{ loop: true }}
          onInit={(typewriter: TypewriterInstance) => {
            typewriter
              .typeString(messages[0].text)
              .pauseFor(2500)
              .deleteAll()
              .callFunction(() => {
                setCurrentImage(messages[1].img);
              })
              .typeString(messages[1].text)
              .pauseFor(2500)
              .deleteAll()
              .callFunction(() => {
                setCurrentImage(messages[0].img);
              })
              .start();
          }}
        />
      </div>
    </div>
  );
};

export default TypeWriterTitle;
