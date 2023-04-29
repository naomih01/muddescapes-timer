import "./EndScreens.css";
import ReactAudioPlayer from "react-audio-player";
import hammer from "./images/hammer.png";
import camera from "./images/camera.png";
import alarm from "./images/alarm.png";
import green_checkmark from "./images/green_checkmark.svg";
import red_x from "./images/red_x.svg";
import { useRef } from "react";

function EndScreen({ checkboxStates, timeRemaining }) {
  return (
    <div className="end-screen-wrapper">
      <div className="end-screen">
        <div className="wall left-wall text-wall">
          <div>
            <h4>Puzzle Designers</h4>
            <p>Ethan Vazquez</p>
            <p>Evan Bourke</p>
            <p>Jasper Cox</p>
            <p>Jordan Carlin</p>
            <p>Joshua Zhong</p>
            <p>Kishore Rajesh</p>
            <p>Naomi Horiguchi</p>
            <p>Occam Kelly Graves</p>
            <p>Toby Frank</p>
          </div>
          <div>
            <h4>Puzzle Designers</h4>
            <p>Adam Tang</p>
            <p>Albany Blackburn</p>
            <p>Anan Aramthanapon</p>
            <p>Bryn Schoen</p>
            <p>Cedar Turek</p>
            <p>Cristian Gonzalez</p>
            <p>Emilynne Newsom</p>
            <p>Ethan Lotan</p>
          </div>
        </div>
        <div
          className="wall right-wall text-wall"
          style={{ textAlign: "right" }}
        >
          <div>
            <h4>President</h4>
            <p>Ashley Cheung</p>
            <h4>Vice President</h4>
            <p>Katheryn Wang</p>
          </div>
          <div>
            <h4>Aesthetics</h4>
            <p>Taylor Levinson</p>
            <p>Tatiana Cardoso</p>
            <p>Occam Kelly Graves</p>
            <p>Naomi Horiguchi</p>
          </div>
        </div>
        <div className="wall ceiling"></div>
        <div className="wall floor">
          <div className="carpet"></div>
        </div>
        <div className="back">
          <div>
            <img
              className={checkboxStates[0] ? "task-success" : "task-failure"}
              src={camera}
              alt="Camera"
            />
            {checkboxStates[0] ? (
              <img src={green_checkmark} alt="Checkmark" />
            ) : (
              <img src={red_x} alt="x" />
            )}
          </div>
          <div>
            <img
              className={checkboxStates[1] ? "task-success" : "task-failure"}
              src={hammer}
              alt="Hammer"
            />
            {checkboxStates[1] ? (
              <img src={green_checkmark} alt="Checkmark" />
            ) : (
              <img src={red_x} alt="x" />
            )}
          </div>
          <div>
            <img
              className={checkboxStates[2] ? "task-success" : "task-failure"}
              src={alarm}
              alt="Alarm"
            />
            {checkboxStates[2] ? (
              <img src={green_checkmark} alt="Checkmark" />
            ) : (
              <img src={red_x} alt="x" />
            )}
          </div>
        </div>
        {timeRemaining ? (
          <div className="header">
            <h2>Congratulations!</h2>
            <p>You finished in: {timeRemaining}</p>
          </div>
        ) : (
          <div className="header">
            <h2>Nice try!</h2>
            <p>
              You completed{" "}
              {checkboxStates.map((s) => (s ? 1 : 0)).reduce((a, b) => a + b)}/3
              objectives
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function WinScreen({ timeRemaining }) {
  const winAudioRef = useRef(null);

  return (
    <>
      <EndScreen
        timeRemaining={timeRemaining}
        checkboxStates={[true, true, true]}
      ></EndScreen>
      <ReactAudioPlayer
        src="disable_alarm_sfx.mp3"
        autoPlay
        on
        onEnded={() => {
          winAudioRef.current?.audioEl.current.play();
        }}
      />
      <ReactAudioPlayer ref={winAudioRef} src="win.mp3" loop />
    </>
  );
}

export function LoseScreen({ checkboxStates }) {
  return (
    <>
      <EndScreen checkboxStates={checkboxStates}></EndScreen>
      <ReactAudioPlayer src="lose.mp3" autoPlay loop />
    </>
  );
}
