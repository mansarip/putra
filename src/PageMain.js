import React from "react";
import { Pane, Text } from "evergreen-ui";
import { useHistory } from "react-router-dom";

export default function App() {
  const history = useHistory();

  return (
    <>
      <Pane
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingTop={30}
        background="url('/images/diamond-upholstery.png')"
      >
        <img src="/images/putra.svg" alt="" style={{ height: 100 }} />
      </Pane>
      <Pane
        display="grid"
        gridTemplateColumns="1fr 1fr"
        columnGap={10}
        padding={15}
        flex={1}
      >
        <MainButton
          icon="qr-code.svg"
          label="QR Code"
          onClick={() => history.push("/qr")}
        />
        <MainButton
          icon="business.svg"
          label="Scanner"
          onClick={() => history.push("/scanner")}
        />
        <MainButton icon="team.svg" label="Reporting" />
        <MainButton icon="document.svg" label="Guide" />
        <MainButton icon="conversation.svg" label="Language" />
        <MainButton icon="heart.svg" label="Donate" />
        <MainButton icon="key.svg" label="Settings" />
        <MainButton icon="bag.svg" label="About" />
      </Pane>
    </>
  );
}

function MainButton({ label, icon, onClick }) {
  return (
    <Pane
      background="#fafafa"
      padding={10}
      boxShadow="0px 1px 1px 1px #ececec"
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
        <img src={`/images/${icon}`} alt="" style={{ width: "100%" }} />
      </Pane>
      <Text fontSize={16} fontWeight="bold" color="#333">
        {label}
      </Text>
    </Pane>
  );
}
