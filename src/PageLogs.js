import React, { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { Icon, Spinner, Text, Pane, Paragraph } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import db from "./db";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import moment from "moment/moment";
import sortObjectsArray from "sort-objects-array";

export default function PageLogs() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  async function fetchList() {
    const records = await db.table("log").toArray();
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

    result = sortObjectsArray(result, "date", "desc");

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
          >
            <Icon icon="search" size={15} />
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
                  // initialScrollOffset={getStoredScrollPosition()}
                  // ref={listElement}
                  // onScroll={({ scrollOffset }) => {
                  //   localStorage.setItem(
                  //     LS_KEY_LISTING_SCROLL_OFFSET,
                  //     scrollOffset
                  //   );
                  // }}
                >
                  {({ index, style }) => {
                    let item = list[index];

                    return (
                      <Pane
                        style={style}
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
                          // onClick={() =>
                          //   history.push("/qr/show", {
                          //     list: list,
                          //     activeRecord: record,
                          //   })
                          // }
                        >
                          <Text
                            fontWeight="bold"
                            color="#333"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            fontSize={15}
                          >
                            {moment(item.date, "YYYYMMDD").format("D MMM YYYY")}
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
                          // onClick={() => {
                          //   setIsShowModalRemove(true);
                          //   setRemoveRecord(record);
                          // }}
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
