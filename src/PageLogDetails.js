import React, { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { Icon, Text, Pane, Paragraph } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import db from "./db";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import moment from "moment/moment";

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
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            padding={15}
          >
            <Icon icon="search" size={15} />
          </Pane>
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
                  itemSize={100}
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
                            {item.name}
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
