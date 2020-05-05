import React, { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { Icon, Text, Pane, Paragraph } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import db from "./db";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import moment from "moment/moment";

export default function PageLogs() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  async function fetchList() {
    // const records = await db.table("log").toArray();
    const records = await db.table("log").orderBy("date").reverse().toArray();
    let result = [];

    for (const record of records) {
      const existed = result.find((rec) => rec.date === record.date);

      if (existed) {
        continue;
      }

      result.push({
        date: record.date,
        total: records.filter((r) => r.date === record.date).length,
      });
    }

    // result = sortObjectsArray(result, "date", "desc");

    setList(result);
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
            Logs
          </Text>
        }
        rightElement={
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            padding={15}
            paddingRight={0}
            onClick={() => history.push("/logs/search")}
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
                  itemSize={70}
                >
                  {({ index, style }) => {
                    let item = list[index];
                    let properDateFormat = moment(item.date, "YYYYMMDD").format(
                      "D MMM YYYY"
                    );

                    return (
                      <Pane
                        style={style}
                        key={index}
                        display="grid"
                        gridTemplateColumns="1fr 50px"
                        columnGap={10}
                        className="tap"
                        marginBottom={1}
                        background={index % 2 === 0 ? "#fff" : "transparent"}
                        onClick={() =>
                          history.push("/logs/detail", {
                            date: item.date,
                            dateTitle: properDateFormat,
                          })
                        }
                      >
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
                            {properDateFormat}
                          </Text>
                          <Text color="#333" fontSize={13}>
                            Total record: {item.total}
                          </Text>
                        </Pane>
                        <Pane
                          display="flex"
                          justifyContent="flex-end"
                          alignItems="center"
                          flexDirection="row"
                          paddingRight={15}
                        >
                          <Icon
                            icon="chevron-right"
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
