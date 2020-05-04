import React, { useState } from "react";
import Topbar from "./Topbar";
import { Text, Pane, TextInput, Paragraph, Alert } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import replaceall from "replaceall";
import db from "./db";

const MAX_NAME = 50;
const MAX_PHONE = 15;

export default function PageNewQR() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isShowError, setIsShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function save() {
    try {
      setIsShowError(false);

      if (name === "") {
        throw new Error("Please insert your name.");
      }

      if (phone === "") {
        throw new Error("Please insert your phone number.");
      }

      const properName = getProperName(name);
      const properPhone = getProperPhone(phone);

      db.table("qrcode").add({
        name: properName,
        phone: properPhone,
        content: `${properName}|${properPhone}`,
      });

      // back
      history.goBack();
    } catch (e) {
      setIsShowError(true);
      setErrorMessage(e.message);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <Topbar
        hasArrowBack
        onClickArrowBack={() => history.goBack()}
        leftElement={
          <Text fontSize={18} color="#333" fontWeight="bold">
            New QR Code
          </Text>
        }
      />

      <Pane marginTop={55} userSelect="none" padding={15}>
        <Paragraph color="#333" fontWeight="bold" marginBottom={4}>
          Your Name
          <Text fontSize={13} float="right">
            {name.length}/{MAX_NAME}
          </Text>
        </Paragraph>
        <TextInput
          autoFocus
          width="100%"
          placeholder="Name"
          height={40}
          color="#333"
          fontSize={17}
          type="search"
          marginBottom={20}
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          maxLength={MAX_NAME}
        />

        <Paragraph color="#333" fontWeight="bold" marginBottom={4}>
          Phone Number
          <Text fontSize={13} float="right">
            {phone.length}/{MAX_PHONE}
          </Text>
        </Paragraph>
        <TextInput
          width="100%"
          placeholder="Phone Number"
          height={40}
          color="#333"
          fontSize={17}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Pane
          display="flex"
          justifyContent="center"
          alignItems="center"
          background="#e3690b"
          height={40}
          color="#fff"
          borderRadius={3}
          className="tap"
          onClick={save}
          textAlign="center"
          marginY={20}
        >
          <Text fontSize={15} color="inherit" fontWeight="bold">
            SAVE
          </Text>
        </Pane>

        {isShowError && (
          <Alert
            intent="danger"
            marginBottom={20}
            appearance="card"
            title="Error"
          >
            {errorMessage}
          </Alert>
        )}
      </Pane>
    </form>
  );
}

function getProperName(value) {
  let result = value;
  result = replaceall("|", "", result);
  result = replaceall("+", "", result);
  result = replaceall("-", "", result);
  result = replaceall("_", "", result);
  return result.trim();
}

function getProperPhone(value) {
  let result = value;
  result = replaceall("|", "", result);
  result = replaceall("+", "", result);
  result = replaceall("-", "", result);
  result = replaceall("_", "", result);
  result = replaceall(" ", "", result);
  return result.trim();
}
