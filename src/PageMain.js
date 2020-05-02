import React from "react";
import { Pane, Text, Heading } from "evergreen-ui";
import { useHistory } from "react-router-dom";

export default function App() {
  const history = useHistory();

  return (
    <>
      <Pane
        display="grid"
        gridTemplateColumns="1fr 1fr"
        columnGap={10}
        paddingY={20}
        paddingX={15}
        borderBottom="0px solid #ececec"
        boxShadow="0px 1px 5px 1px #ececec"
        background="#fff"
        userSelect="none"
      >
        <Pane display="flex" alignItems="center" userSelect="none">
          <Heading
            userSelect="none"
            fontWeight="bold"
            color="#333"
            fontFamily="inherit"
            fontSize={20}
          >
            Putra.me
          </Heading>
        </Pane>

        <Pane
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          userSelect="none"
          className="tap"
        >
          <img
            src="/images/comment.svg"
            alt=""
            style={{ height: 20, marginRight: 10 }}
          />
          <Text color="#333" fontWeight="bold">
            Lang (EN)
          </Text>
        </Pane>
      </Pane>

      <Pane
        display="grid"
        gridTemplateColumns="1fr 1fr"
        columnGap={10}
        padding={15}
      >
        <MainButton
          icon="qr-code.svg"
          label="Generate QR"
          onClick={() => history.push("/qr")}
        />
        <MainButton icon="business.svg" label="Scanner" />
        <MainButton icon="team.svg" label="Reporting" />
        <MainButton icon="document.svg" label="Others" />
      </Pane>
    </>
  );
}

function MainButton({ label, icon, onClick }) {
  return (
    <Pane
      background="#fff"
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
