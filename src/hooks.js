import { useState, useEffect, useRef } from "react";
import mqtt from "mqtt";

export const CHECKBOXES = [
  {
    topic: "muddescapes/data/Security Cameras/disabled",
    name: "Disable the security cameras",
  },
  {
    topic: "muddescapes/data/Final Pedestal/Hammer Stolen",
    name: "Steal the most precious artifact",
  },
  {
    topic: "muddescapes/data/Fingerprint Sensor/Alarm Disarmed",
    name: "Disarm the alarm",
  },
];

function inIframe() {
  let ans = true;
  try {
    ans = window.self !== window.top;
  } catch (e) {}
  return ans;
}

export function useCheckboxStates({ onWin, onTaskComplete }) {
  let [checkboxStates, setCheckboxStates] = useState(
    CHECKBOXES.map(() => false)
  );
  const prevStateRef = useRef(checkboxStates);

  // call callbacks in a separate useEffect to avoid MQTT reconnects
  // every time the arguments are updated
  useEffect(() => {
    // TODO: Hacky solution alert!
    // only set win when outside of iframe to get around some clients mistakenly
    // setting win every second
    // since multiple windows may be open in an iframe due to the control center,
    // but only one window is open outside of the iframe (in the room), this
    // should make only one window set win
    if (!inIframe() && checkboxStates.every((c) => c)) {
      onWin();
    }

    const prevState = prevStateRef.current;
    for (let i = 0; i < checkboxStates.length; i++) {
      if (checkboxStates[i] && !prevState[i]) {
        onTaskComplete(i);
      }
    }
    prevStateRef.current = [...checkboxStates];
  }, [checkboxStates, onWin, onTaskComplete]);

  useEffect(() => {
    const client = mqtt.connect("wss://broker.hivemq.com:8884", {
      path: "/mqtt",
    });

    client.on("connect", () => {
      console.debug("connected");

      CHECKBOXES.forEach(({ topic }) => {
        client.subscribe(topic, { qos: 2 });
      });

      // request variable updates from puzzles
      client.publish("muddescapes", "", { qos: 1 });
    });

    client.on("message", (topic, message) => {
      const idx = CHECKBOXES.findIndex(({ topic: t }) => t === topic);
      if (idx >= 0) {
        setCheckboxStates((curr) => {
          const newStates = [...curr];
          newStates[idx] = message.toString() === "1";
          return newStates;
        });
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return [
    checkboxStates,
    () => {
      setCheckboxStates(CHECKBOXES.map(() => false));
    },
  ];
}
