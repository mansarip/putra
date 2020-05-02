import React, { useState } from "react";
import Topbar from "./Topbar";
import QRCode from "qrcode.react";
import { Pane, TextInput } from "evergreen-ui";

export default function PageQR() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <>
      <Topbar />

      <Pane marginTop={60}>
        <TextInput value={name} onChange={(e) => setName(e.target.value)} />
      </Pane>

      <QRCode value={name} />
    </>
  );
}
