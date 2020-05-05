import React from "react";
import { Pane, Text, Icon } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import SVGPutraLogo from "./svg/putralogo.svg";

export default function App() {
  const history = useHistory();

  return (
    <>
      <Pane
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        background="#fff"
        flex={1}
        display="flex"
        flexDirection="column"
      >
        <Pane
          display="flex"
          justifyContent="center"
          alignItems="center"
          background="url('/images/diamond-upholstery.png')"
          flex={1.5}
          flexDirection="column"
          position="relative"
          overflow="hidden"
        >
          <img src={SVGPutraLogo} alt="" style={{ height: 100 }} />
        </Pane>

        <Pane height={1} background="#e0e0e0"></Pane>
        <Pane height={1} background="#fff"></Pane>
        <Pane
          background="#fafafa"
          flex={1}
          display="grid"
          gridTemplateColumns="1fr 1fr"
          columnGap={10}
          padding={10}
        >
          <MainButton
            // icon={SVGQrcode}
            color="#084B8A"
            icon="id-number"
            label="QR Code"
            onClick={() => history.push("/qr")}
          />

          <MainButton
            // icon={SVGBusiness}
            color="#BF0E08"
            icon="camera"
            label="Scanner"
            onClick={() => history.push("/scanner")}
          />

          <MainButton
            // icon={SVGDocument}
            color="#00783E"
            icon="git-repo"
            label="Logs"
            onClick={() => history.push("/logs")}
          />

          <MainButton icon="user" label="About" color="#37248F" />
        </Pane>
      </Pane>
    </>
  );
}

function MainButton({ label, icon, onClick, background, color }) {
  return (
    <Pane
      background={background || "#fff"}
      padding={10}
      boxShadow="0px 2px 3px 1px #ececec"
      borderRadius={5}
      userSelect="none"
      textAlign="center"
      marginBottom={10}
      className="tap"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      onClick={onClick || null}
    >
      <Pane width={50} marginY={10}>
        {/* <img src={`/images/${icon}`} alt="" style={{ width: "100%" }} /> */}
        {/* <img src={icon} alt="" style={{ width: "100%" }} /> */}
        <Icon icon={icon} size="100%" color={color} />
      </Pane>
      <Text fontSize={16} fontWeight="bold" color="#333">
        {label}
      </Text>
    </Pane>
  );
}
