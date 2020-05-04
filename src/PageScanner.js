import React, { useState } from "react";
import Topbar from "./Topbar";
import { Icon, Text, Pane, Paragraph } from "evergreen-ui";
import { useHistory } from "react-router-dom";
// import { openDB } from "idb";
import QrReader from "react-qr-reader";
import useSound from "use-sound";
import beep from "./beep.wav";
import moment from "moment/moment";
import db from "./db";

const READY = "READY";
const SUCCESS = "SUCCESS";
const FAILED = "FAILED";
const BEEP_OFF = "BEEP_OFF";

export default function PageScanner() {
  const history = useHistory();
  const [playBeep] = useSound(beep);
  const [isBeepOn, setIsBeepOn] = useState(localStorage.getItem(BEEP_OFF) === "1" ? false : true); // prettier-ignore
  const [cameraStatus, setCameraStatus] = useState(READY);

  function processResult(result) {
    if (!result) {
      return;
    }

    const splitResult = result.split("|");

    if (splitResult.length > 2) {
      scanFailed(result);
      return;
    }

    const name = splitResult[0];
    const phone = splitResult[1];

    if (name && name !== "" && phone && phone !== "") {
      scanSuccess({ name, phone, result });
    } else {
      scanSuccess({ name, phone, result });
    }
  }

  function scanFailed({ result }) {
    if (isBeepOn) {
      playBeep();
    }

    setCameraStatus(FAILED);

    storeRecord({
      isSuccess: false,
      rawData: result,
    });
  }

  function scanSuccess({ name, phone, result }) {
    if (isBeepOn) {
      playBeep();
    }

    setCameraStatus(SUCCESS);

    storeRecord({
      name,
      phone,
      isSuccess: true,
      rawData: result,
    });
  }

  function handleClickShutter() {
    if (cameraStatus === READY) {
      return;
    }
    setCameraStatus(READY);
  }

  async function storeRecord({
    name = null,
    phone = null,
    isSuccess = false,
    rawData = null,
  }) {
    const now = moment();

    db.table("log").add({
      name,
      phone,
      date: now.format("YYYYMMDD"),
      time: now.format("HHmm"),
      year: now.format("YYYY"),
      month: now.format("MM"),
      day: now.format("DD"),
      hour: now.format("HH"),
      minute: now.format("mm"),
      isSuccess,
      rawData,
    });
  }

  return (
    <>
      <Topbar
        hasArrowBack
        onClickArrowBack={() => history.replace("/")}
        leftElement={
          <Text fontSize={18} color="#333" fontWeight="bold">
            Scanner
          </Text>
        }
        rightElement={
          <Pane
            display="flex"
            alignItems="center"
            background="#e3690b"
            paddingX={10}
            paddingY={6}
            color="#fff"
            borderRadius={20}
            onClick={() => {
              setIsBeepOn(!isBeepOn);
              localStorage.setItem(BEEP_OFF, isBeepOn ? "1" : "0");
            }}
          >
            <Icon
              icon={isBeepOn ? "volume-up" : "volume-off"}
              marginRight={5}
              size={13}
            />
            <Text fontSize={14} color="inherit" fontWeight="bold">
              {isBeepOn ? "On" : "Off"}
            </Text>
          </Pane>
        }
      />

      <Pane
        position="absolute"
        top={55}
        bottom={0}
        left={0}
        right={0}
        display="flex"
        flex={1}
        flexDirection="column"
      >
        <Pane flex={1} flexDirection="column" background="#000">
          <QrReader
            showViewFinder={cameraStatus === READY}
            onError={(a) => console.log(a)}
            onScan={(result) => processResult(result)}
          />
        </Pane>

        <Pane
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Pane
            background={getButtonColor(cameraStatus)}
            height={100}
            width={100}
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleClickShutter}
          >
            <Text
              color={cameraStatus !== READY ? "#fff" : "#333"}
              fontSize={15}
              fontWeight="bold"
            >
              {cameraStatus === READY && "Ready"}
              {cameraStatus === SUCCESS && "DONE!"}
            </Text>
          </Pane>

          <Paragraph color="#333" marginY={10}>
            {cameraStatus === READY && "Ready to scan."}
            {cameraStatus === SUCCESS && "Tap to continue."}
          </Paragraph>

          <button
            style={{ padding: 5 }}
            onClick={() => processResult("LUQMAN|0133155750")}
          >
            TEST
          </button>
        </Pane>
      </Pane>
    </>
  );
}

function getButtonColor(status) {
  if (status === READY) {
    return "#ffeede";
  }

  if (status === SUCCESS) {
    return "#16b528";
  }
}
