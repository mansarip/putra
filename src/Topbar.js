import React from "react";
import { Pane, Icon } from "evergreen-ui";

export default function Topbar({
  hasArrowBack = false,
  onClickArrowBack,
  leftElement = null,
  rightElement = null,
}) {
  let columnGrid = "1fr 1fr";

  if (hasArrowBack) {
    columnGrid = "55px 1fr 1fr";
  }

  return (
    <>
      <Pane
        height={55}
        background="#fff"
        // boxShadow="0px 1px 5px 1px #ececec"
        borderBottom="1px solid #ececec"
        userSelect="none"
        position="fixed"
        top={0}
        left={0}
        right={0}
        display="grid"
        gridTemplateColumns={columnGrid}
        zIndex={10}
      >
        {hasArrowBack && (
          <Pane
            display="flex"
            justifyContent="center"
            alignItems="center"
            className="tap"
            onClick={onClickArrowBack || null}
          >
            <Icon icon="arrow-left" size={20} />
          </Pane>
        )}
        <Pane display="flex" alignItems="center">
          {leftElement}
        </Pane>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          paddingRight={15}
        >
          {rightElement}
        </Pane>
      </Pane>
    </>
  );
}
