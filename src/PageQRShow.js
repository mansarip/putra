import React, { useState } from "react";
import { Text, Paragraph, Icon, Pane } from "evergreen-ui";
import QRCode from "qrcode.react";
import { useHistory } from "react-router-dom";

const PREV = "PREV";
const NEXT = "NEXT";

export default function PageQRShow() {
  const history = useHistory();
  const { activeRecord, list } = history.location.state;
  const [activeIndex, setActiveIndex] = useState(getActiveIndex(activeRecord, list)); // prettier-ignore
  const [name, setName] = useState(activeRecord ? activeRecord.name : "");
  const [phone, setPhone] = useState(activeRecord ? activeRecord.phone : "");
  const [content, setContent] = useState(activeRecord ? activeRecord.content : ""); // prettier-ignore

  function changeQR(type) {
    if (type === NEXT) {
      const nextRecord = list[activeIndex + 1];

      if (nextRecord) {
        setName(nextRecord.name);
        setPhone(nextRecord.phone);
        setContent(nextRecord.content);
        setActiveIndex(activeIndex + 1);
      }
    } else if (type === PREV) {
      const prevRecord = list[activeIndex - 1];

      if (prevRecord) {
        setName(prevRecord.name);
        setPhone(prevRecord.phone);
        setContent(prevRecord.content);
        setActiveIndex(activeIndex - 1);
      }
    }
  }

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
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <QRCode value={content} renderAs="svg" size={260} />
        <Paragraph
          marginTop={15}
          color="#333"
          textAlign="center"
          fontWeight="bold"
          userSelect="none"
        >
          {name}
          <br />
          {phone}
        </Paragraph>
      </Pane>

      <Pane
        height={200}
        backgroundColor="#ececec"
        borderTop="1px solid #e0e0e0"
      >
        {list.length > 1 && (
          <Pane
            display="grid"
            gridTemplateColumns="1fr 1fr"
            margin={15}
            columnGap={10}
          >
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="center"
              background="#fff"
              padding={15}
              borderRadius={25}
              className="tap"
              userSelect="none"
              onClick={() => changeQR(PREV)}
            >
              <Icon icon="chevron-left" marginRight={5} />
              <Text color="#333" fontWeight="bold">
                Previous
              </Text>
            </Pane>
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="center"
              background="#fff"
              padding={15}
              borderRadius={25}
              className="tap"
              userSelect="none"
              onClick={() => changeQR(NEXT)}
            >
              <Text color="#333" fontWeight="bold">
                Next
              </Text>
              <Icon icon="chevron-right" marginLeft={5} />
            </Pane>
          </Pane>
        )}

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
          onClick={() => history.replace("/qr")}
        >
          <Text color="#fff" fontWeight="bold">
            Close
          </Text>
        </Pane>
      </Pane>
    </Pane>
  );
}

function getActiveIndex(activeRecord, list = []) {
  return list.findIndex((record) => record.id === activeRecord.id);
}
