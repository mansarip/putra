import React, { useState } from "react";
import Topbar from "./Topbar";
import { Icon, Text, Pane, Paragraph, Dialog, Textarea } from "evergreen-ui";
import { useHistory } from "react-router-dom";
// import { openDB } from "idb";
import QrReader from "react-qr-reader";
import useSound from "use-sound";
import beep from "./beep.wav";
import errorBuzz from "./error.wav";
import moment from "moment/moment";
import db from "./db";
import capitalize from "capitalize";

const READY = "READY";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const BEEP_OFF = "BEEP_OFF";

const colors = {
  READY: {
    background: "#ececec",
    border: "#ecdbca",
  },
  SUCCESS: {
    background: "#16b528",
    border: "#157b20",
  },
  ERROR: {
    background: "#cc0606",
    border: "#862a0e",
  },
};

export default function PageScanner() {
  const history = useHistory();
  const [playBeep] = useSound(beep);
  const [playErrorBuzz] = useSound(errorBuzz);
  const [isSoundOn, setIsSoundOn] = useState(localStorage.getItem(BEEP_OFF) === "1" ? false : true); // prettier-ignore
  const [cameraStatus, setCameraStatus] = useState(READY);
  const [isShowModalSuccess, setIsShowModalSuccess] = useState(false);
  const [modalResultSuccess, setModalResultSuccess] = useState({});
  const [isShowModalError, setIsShowModalError] = useState(false);
  const [modalResultError, setModalResultError] = useState("");

  function processResult(result) {
    if (!result) {
      return;
    }

    // prevent untuk scan kali kedua secara auto
    if (cameraStatus !== READY) {
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
      scanFailed({ result });
    }
  }

  function scanFailed({ result }) {
    if (isSoundOn) {
      playErrorBuzz();
    }

    setCameraStatus(ERROR);
    setIsShowModalError(true);
    setModalResultError(result);
  }

  function scanSuccess({ name, phone, result }) {
    if (isSoundOn) {
      playBeep();
    }

    setCameraStatus(SUCCESS);
    setIsShowModalSuccess(true);
    setModalResultSuccess({ name, phone });

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
      // date: "20200510",
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
            background={isSoundOn ? "green" : "#e3690b"}
            paddingX={10}
            paddingY={6}
            color="#fff"
            borderRadius={20}
            onClick={() => {
              setIsSoundOn(!isSoundOn);
              localStorage.setItem(BEEP_OFF, isSoundOn ? "1" : "0");
            }}
          >
            <Icon
              icon={isSoundOn ? "volume-up" : "volume-off"}
              marginRight={5}
              size={13}
            />
            <Text fontSize={14} color="inherit" fontWeight="bold">
              {isSoundOn ? "On" : "Off"}
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
            delay={cameraStatus === READY ? 1300 : false}
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
          onClick={handleClickShutter}
        >
          <Pane
            background={colors[cameraStatus].background}
            // borderBottom={`6px solid ${colors[cameraStatus].border}`}
            height={100}
            width={100}
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              color={cameraStatus !== READY ? "#fff" : "#333"}
              fontSize={15}
              fontWeight="bold"
            >
              {cameraStatus === READY && "Ready"}
              {cameraStatus === SUCCESS && "DONE!"}
              {cameraStatus === ERROR && "ERROR!"}
            </Text>
          </Pane>

          <Paragraph color="#333" marginY={10} lineHeight={1.2} fontSize={17}>
            {cameraStatus === READY && "Scan a QR code."}
            {cameraStatus === SUCCESS && "Tap to continue."}
            {cameraStatus === ERROR && "Tap to continue."}
          </Paragraph>

          {process.env.NODE_ENV === "development" && (
            <>
              <button onClick={() => processResult("LUQMAN|012345678")}>
                Success
              </button>

              <button onClick={() => processResult("UNKNOWNTEXT")}>Fail</button>
            </>
          )}
        </Pane>
      </Pane>

      <ModalSuccess
        open={isShowModalSuccess}
        onClose={() => {
          setIsShowModalSuccess(false);
          handleClickShutter();
        }}
        result={modalResultSuccess}
      />

      <ModalError
        open={isShowModalError}
        onClose={() => {
          setIsShowModalError(false);
          handleClickShutter();
        }}
        result={modalResultError}
      />
    </>
  );
}

function ModalSuccess({ open, onClose, result }) {
  return (
    <Dialog
      isShown={open}
      hasHeader={false}
      hasFooter={false}
      onCloseComplete={onClose}
    >
      <Paragraph color="#333" marginBottom={7}>
        Result :
        <br />
        <Text color="green" fontWeight="bold" fontSize={16}>
          SUCCESS <Icon icon="endorsed" size={12} />
        </Text>
      </Paragraph>

      <Paragraph color="#333" marginBottom={7}>
        Name :
        <br />
        <Text color="#333" fontWeight="bold" fontSize={16}>
          {capitalize.words(result.name || "")}
        </Text>
      </Paragraph>

      <Paragraph color="#333" marginBottom={7}>
        Phone Number :
        <br />
        <Text color="#333" fontWeight="bold" fontSize={16}>
          {capitalize.words(result.phone || "")}
        </Text>
      </Paragraph>

      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="#e3690b"
        paddingX={10}
        paddingY={10}
        color="#fff"
        borderRadius={20}
        className="tap"
        onClick={onClose}
        marginTop={25}
      >
        <Text fontSize={14} color="inherit" fontWeight="bold">
          CLOSE
        </Text>
      </Pane>
    </Dialog>
  );
}

function ModalError({ open, onClose, result }) {
  return (
    <Dialog
      isShown={open}
      hasHeader={false}
      hasFooter={false}
      onCloseComplete={onClose}
    >
      <Paragraph color="#333" marginBottom={7}>
        Result :
        <br />
        <Text color={colors.ERROR.background} fontWeight="bold" fontSize={16}>
          ERROR <Icon icon="warning-sign" size={12} />
        </Text>
      </Paragraph>

      <Paragraph color="#333" marginBottom={7}>
        QR Content :
        <br />
        <Textarea height={150} readOnly value={result}></Textarea>
      </Paragraph>

      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="#e3690b"
        paddingX={10}
        paddingY={10}
        color="#fff"
        borderRadius={20}
        className="tap"
        onClick={onClose}
        marginTop={25}
      >
        <Text fontSize={14} color="inherit" fontWeight="bold">
          CLOSE
        </Text>
      </Pane>
    </Dialog>
  );
}
