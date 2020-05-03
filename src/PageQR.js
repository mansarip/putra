import React, { useState, useEffect } from "react";
import Topbar from "./Topbar";
import QRCode from "qrcode.react";
import { Icon, Spinner, Text, Pane, Paragraph } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import { openDB } from "idb";
import { DB_NAME } from "./constant";

export default function PageQR() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  async function fetchList() {
    // open db
    const db = await openDB(DB_NAME, 1, {
      upgrade: (db) => {
        // buat jika tiada
        db.createObjectStore("qrcodes", {
          keyPath: "id",
          autoIncrement: true,
        });
      },
    });

    const res = await db.getAll("qrcodes");
    db.close();

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
        onClickArrowBack={() => history.goBack()}
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
            <Icon icon="plus" marginRight={5} />
            <Text fontSize={14} color="inherit" fontWeight="bold">
              New
            </Text>
          </Pane>
        }
      />

      <Pane marginTop={55} userSelect="none">
        {isLoading && (
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={20}
          >
            <Spinner />
          </Pane>
        )}

        {!isLoading && list.length > 0 && (
          <Pane background="#ececec">
            {list.map((record, index) => (
              <Pane
                key={index}
                display="grid"
                gridTemplateColumns="1fr 1fr"
                columnGap={10}
                className="tap"
                background="#fff"
                marginBottom={2}
              >
                <Pane
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  padding={15}
                >
                  <Text fontWeight="bold" color="#333">
                    {record.name}
                  </Text>
                  <Text>{record.phone}</Text>
                </Pane>
                <Pane
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  flexDirection="row"
                  paddingRight={15}
                >
                  <Icon icon="search" color="grey" marginRight={5} size={12} />
                  <Text color="grey">Show QR</Text>
                </Pane>
              </Pane>
            ))}
          </Pane>
        )}

        {!isLoading && list.length <= 0 && (
          <Paragraph
            color="#333"
            fontSize={15}
            textAlign="center"
            paddingY={20}
          >
            You don't have any saved qr code.
            <br />
            Tap <b>+New</b> to generate.
          </Paragraph>
        )}
      </Pane>

      {/* <QRCode value={name} /> */}
    </>
  );
}
