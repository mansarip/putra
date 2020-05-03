import React, { useState, useEffect } from "react";
import { Text, Pane, TextInput } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import QrReader from "react-qr-reader";
import useSound from "use-sound";
import beep from "./beep.wav";

const READY = "READY";
const SUCCESS = "SUCCESS";

export default function PageQRShow() {
  const history = useHistory();
  const [playBeep] = useSound(beep);
  const [cameraStatus, setCameraStatus] = useState(READY);
  const [result, setResult] = useState({});

  function processResult(result) {
    if (!result) {
      return;
    }

    const [name, phone] = result.split("|");
    scanSuccess({ name, phone });
  }

  function scanSuccess({ name, phone }) {
    playBeep();
    setResult({
      name,
      phone,
    });

    setCameraStatus(SUCCESS);
  }

  useEffect(() => {
    if (cameraStatus === SUCCESS) {
      setTimeout(() => {
        setCameraStatus(READY);
        setResult({ name: "", phone: "" });
      }, 150);
    }
  }, [cameraStatus]);

  return (
    <Pane
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      flexDirection="column"
    >
      <Pane
        flex={1}
        // display="flex"
        // alignItems="center"
        // justifyContent="center"
        flexDirection="column"
        background="#000"
      >
        <QrReader
          showViewFinder={false}
          onError={(a) => console.log(a)}
          onScan={(result) => processResult(result)}
        />
      </Pane>

      <Pane height={300} backgroundColor="#fff">
        {cameraStatus === READY && (
          <Pane
            background="#d7fbd7"
            height={40}
            display="flex"
            alignItems="center"
            justifyContent="center"
            userSelect="none"
          >
            <Text fontWeight="bold" color="#368836" fontSize={15}>
              Camera : Ready
            </Text>
          </Pane>
        )}

        {cameraStatus === SUCCESS && (
          <Pane
            background="#087d00"
            height={40}
            display="flex"
            alignItems="center"
            justifyContent="center"
            userSelect="none"
          >
            <Text fontWeight="bold" color="#fff" fontSize={15}>
              SUCCESS
            </Text>
          </Pane>
        )}

        <Pane padding={15}>
          {/* <button
            style={{ padding: 5 }}
            onClick={() =>
              scanSuccess({
                name: "LUQMAN",
                phone: "0133155750",
              })
            }
          >
            TEST
          </button> */}
          <TextInput
            placeholder="Name"
            width="100%"
            fontSize={16}
            marginBottom={5}
            disabled
            value={result.name}
          />
          <TextInput
            placeholder="Phone Number"
            width="100%"
            fontSize={16}
            disabled
            value={result.phone}
          />
        </Pane>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          background="#e3690b"
          padding={10}
          borderRadius={25}
          className="tap"
          userSelect="none"
          margin={15}
          onClick={() => history.replace("/")}
        >
          <Text color="#fff" fontWeight="bold">
            Close
          </Text>
        </Pane>
      </Pane>
    </Pane>
  );
}
