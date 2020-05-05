import React, { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { Position, Icon, Text, Pane, Paragraph, Popover } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import db from "./db";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import moment from "moment/moment";
import capitalize from "capitalize";
import { unparse } from "papaparse";

export default function PageLogDetails() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const { dateTitle, date } = history.location.state;

  async function fetchList(date) {
    let result = await db.table("log").where({ date: date }).sortBy("time");
    result = result.reverse();

    setList(result);
    setIsLoading(false);
  }

  function saveAsCSV() {
    const data = [];
    const header = [
      "NAME",
      "PHONE NUMBER",
      "DATETIME",
      "DATE",
      "YEAR",
      "MONTH",
      "DAY",
      "TIME",
      "HOUR",
      "MINUTE",
    ];

    for (const record of list) {
      data.push([
        record.name,
        record.phone,
        moment(record.date + record.time, "YYYYMMDDHHmm").format(
          "DD-MM-YYYY HH:mm A"
        ),
        record.date,
        record.year,
        record.month,
        record.day,
        record.time,
        record.hour,
        record.minute,
      ]);
    }

    const csv = unparse(
      {
        fields: header,
        data: data,
      },
      {
        quotes: true,
      }
    );

    const hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = `putra_log_${date}.csv`;
    hiddenElement.click();
  }

  useEffect(() => {
    fetchList(date);
  }, [date]);

  return (
    <>
      <Topbar
        hasArrowBack
        onClickArrowBack={() => history.goBack()}
        leftElement={
          <Text fontSize={18} color="#333" fontWeight="bold">
            {dateTitle}
          </Text>
        }
        rightElement={
          <Popover
            position={Position.BOTTOM}
            content={({ close }) => (
              <Pane
                width={300}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                background="#ececec"
              >
                <MenuOption
                  icon="panel-table"
                  title="Download as .CSV"
                  description="Save to your device as .csv file. This file can be opened with MS Excel or Google Sheet."
                  color="green"
                  onClick={() => {
                    close();
                    saveAsCSV();
                  }}
                />
                <MenuOption
                  icon="trash"
                  title="Delete Log"
                  description="Permanently remove this log. Note that this action cannot be undone."
                  color="#cc0606"
                />
              </Pane>
            )}
          >
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              padding={15}
              paddingRight={0}
            >
              <Icon icon="more" size={15} />
            </Pane>
          </Popover>
        }
      />

      <Pane marginTop={55} userSelect="none">
        {!isLoading && list.length <= 0 && (
          <Paragraph
            color="#333"
            fontSize={15}
            textAlign="center"
            paddingY={20}
          >
            No logs available.
          </Paragraph>
        )}

        {!isLoading && list.length > 0 && (
          <Pane position="absolute" top={55} left={0} right={0} bottom={0}>
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemCount={list.length}
                  itemSize={90}
                >
                  {({ index, style }) => {
                    let item = list[index];

                    return (
                      <Pane
                        style={style}
                        key={index}
                        display="grid"
                        gridTemplateColumns="20px 1fr 50px"
                        background={index % 2 === 0 ? "#fff" : "transparent"}
                      >
                        <Pane
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          padding={15}
                          textAlign="center"
                        >
                          <Text color="#333" fontSize={14}>
                            {index + 1}
                          </Text>
                        </Pane>
                        <Pane
                          display="flex"
                          justifyContent="center"
                          flexDirection="column"
                          padding={15}
                          overflow="hidden"
                        >
                          <Text
                            fontWeight="bold"
                            color="#333"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            fontSize={15}
                          >
                            {capitalize.words(item.name)}
                          </Text>
                          <Text color="#333" fontSize={14}>
                            Tel: {item.phone}
                            <br />
                            Time: {moment(item.time, "HHmm").format("HH:mm A")}
                          </Text>
                        </Pane>
                        <Pane
                          display="flex"
                          justifyContent="flex-end"
                          alignItems="center"
                          flexDirection="row"
                          paddingRight={15}
                          onClick={() =>
                            (document.location.href = "tel:" + item.phone)
                          }
                        >
                          <Icon
                            icon="phone"
                            color="grey"
                            marginRight={5}
                            size={15}
                          />
                        </Pane>
                      </Pane>
                    );
                  }}
                </FixedSizeList>
              )}
            </AutoSizer>
          </Pane>
        )}
      </Pane>
    </>
  );
}

function MenuOption({ title, description, color, icon, onClick }) {
  return (
    <Pane
      display="grid"
      gridTemplateColumns="50px 1fr"
      padding={10}
      className="tap"
      marginBottom={1}
      background="#fff"
      userSelect="none"
      onClick={onClick || null}
    >
      <Pane textAlign="center" paddingTop={3}>
        <Icon icon={icon} size={20} color={color} />
      </Pane>
      <Pane lineHeight={1.2}>
        <Text color="#333" fontWeight="bold" fontSize={15}>
          {title}
        </Text>
        <br />
        <Text>{description}</Text>
      </Pane>
    </Pane>
  );
}
