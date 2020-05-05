import React, { useState, useEffect, useMemo } from "react";
import { Icon, Text, Pane, Paragraph } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import db from "./db";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import moment from "moment/moment";
import capitalize from "capitalize";
import matchSorter from "match-sorter";

export default function PageLogSearch() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  // const { dateTitle, date } = history.location.state;

  async function fetchList() {
    const list = await db.table("log").toArray();
    setList(list);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchList();
  }, []);

  useMemo(() => {
    if (searchValue.length >= 3) {
      const result = matchSorter(list, searchValue, {
        keys: [
          { threshold: matchSorter.rankings.CONTAINS, key: "name" },
          { threshold: matchSorter.rankings.CONTAINS, key: "phone" },
        ],
      });

      setSearchResult(result);
    } else {
      setSearchResult([]);
    }
  }, [list, searchValue]);

  console.log(searchResult);

  return (
    <>
      <Pane
        height={55}
        background="#fff"
        boxShadow="0px 1px 5px 1px #ececec"
        userSelect="none"
        position="fixed"
        top={0}
        left={0}
        right={0}
        display="grid"
        gridTemplateColumns="55px 1fr"
        zIndex={10}
      >
        <Pane
          display="flex"
          justifyContent="center"
          alignItems="center"
          className="tap"
          onClick={() => history.goBack()}
        >
          <Icon icon="arrow-left" size={20} />
        </Pane>
        <Pane display="flex" alignItems="center" paddingRight={15}>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            autoFocus
            type="search"
            placeholder="Search name, phone number"
            style={{
              fontFamily: "inherit",
              fontSize: 16,
              outline: "none",
              height: "100%",
              width: "100%",
              border: "none",
            }}
          />
        </Pane>
      </Pane>
      {/* <Topbar
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
      /> */}

      <Pane marginTop={55} userSelect="none">
        {!isLoading && searchValue.length > 0 && searchResult.length <= 0 && (
          <Paragraph
            color="#333"
            fontSize={15}
            textAlign="center"
            paddingY={20}
          >
            No result available.
          </Paragraph>
        )}

        {!isLoading && searchResult.length > 0 && (
          <Pane position="absolute" top={55} left={0} right={0} bottom={0}>
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemCount={searchResult.length}
                  itemSize={90}
                >
                  {({ index, style }) => {
                    let item = searchResult[index];

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
                            Date:{" "}
                            {moment(
                              item.date + item.time,
                              "YYYYMMDDHHmm"
                            ).format("D MMM YYYY, HH:mm A")}
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
