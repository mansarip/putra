import React, { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { Icon, Text, Pane, Paragraph, Dialog } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import db from "./db";
import capitalize from "capitalize";

export default function PageQR() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const [isShowModalRemove, setIsShowModalRemove] = useState(false);
  const [removeRecord, setRemoveRecord] = useState({});

  async function remove(recordId) {
    await db.table("qrcode").delete(recordId);
  }

  async function fetchList() {
    const res = await db.table("qrcode").toArray();
    setList(res.reverse());
    setIsLoading(false);
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <Topbar
        hasArrowBack
        onClickArrowBack={() => history.replace("/")}
        leftElement={
          <Text fontSize={18} color="#333" fontWeight="bold">
            QR Code
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
            className="tap"
            onClick={() => history.push("/qr/new")}
          >
            <Icon icon="plus" marginRight={5} size={15} />
            <Text fontSize={14} color="inherit" fontWeight="bold">
              New
            </Text>
          </Pane>
        }
      />

      <Pane marginTop={55} userSelect="none">
        {!isLoading && list.length > 0 && (
          <Pane background="#ececec">
            {list.map((record, index) => (
              <Pane
                key={index}
                display="grid"
                gridTemplateColumns="1fr 50px"
                columnGap={10}
                className="tap"
                background="#fff"
                marginBottom={1}
              >
                <Pane
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  padding={15}
                  overflow="hidden"
                  onClick={() =>
                    history.push("/qr/show", {
                      list: list,
                      activeRecord: record,
                    })
                  }
                >
                  <Text
                    fontWeight="bold"
                    color="#333"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    fontSize={17}
                  >
                    {capitalize.words(record.name)}
                  </Text>
                  <Text color="#333" fontSize={15}>
                    {record.phone}
                  </Text>
                </Pane>
                <Pane
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  flexDirection="row"
                  paddingRight={15}
                  onClick={() => {
                    setIsShowModalRemove(true);
                    setRemoveRecord(record);
                  }}
                >
                  <Icon
                    icon="ban-circle"
                    color="#cc0606"
                    marginRight={5}
                    size={15}
                  />
                  {/* <Text color="#cc0606">Remove</Text> */}
                </Pane>
              </Pane>
            ))}
          </Pane>
        )}

        {!isLoading && list.length <= 0 && (
          <Paragraph
            color="#333"
            fontSize={16}
            textAlign="center"
            paddingY={20}
          >
            You don't have any saved qr code.
            <br />
            Tap <b>+New</b> to generate.
          </Paragraph>
        )}
      </Pane>

      <Dialog
        isShown={isShowModalRemove}
        hasHeader={false}
        hasFooter={false}
        onCloseComplete={() => setIsShowModalRemove(false)}
      >
        <Paragraph
          fontSize={18}
          color="#333"
          fontWeight="bold"
          textAlign="center"
          // paddingY={20}
        >
          Remove QR Code?
        </Paragraph>
        <Paragraph color="#333" marginY={15} textAlign="center">
          {removeRecord.name}
          <br />
          {removeRecord.phone}
        </Paragraph>
        <Pane
          display="grid"
          gridTemplateColumns="1fr 1fr"
          columnGap={10}
          paddingX={10}
        >
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            background="#ececec"
            height={35}
            borderRadius={20}
            className="tap"
            onClick={() => setIsShowModalRemove(false)}
          >
            <Text fontSize={15} fontWeight="bold" color="#333">
              Cancel
            </Text>
          </Pane>
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            background="#cc0606"
            height={35}
            borderRadius={20}
            className="tap"
            onClick={() => {
              setIsShowModalRemove(false);
              remove(removeRecord.id);
              fetchList();
              setRemoveRecord({});
            }}
          >
            <Text fontSize={15} fontWeight="bold" color="#fff">
              Yes, Remove
            </Text>
          </Pane>
        </Pane>
      </Dialog>
    </>
  );
}
