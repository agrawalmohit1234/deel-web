import React, { useState, useRef, useCallback } from "react";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import "./index.css";

const AutoComplete = ({ data, maxResults, debounceDelayTime }) => {
  const allOptions = useRef();
  const [optionToVisible, setOptionToVisible] = useState(maxResults);
  const [showOption, setShowOption] = useState(false);
  const [totalData, setTotalData] = useState(data.colors.sort());
  const [inputVal, setInputVal] = useState("");
  const [colorToShow, setColorToShow] = useState(
    data.colors.slice(0, optionToVisible).sort()
  );

  const getPossibleOption = (value) => {
    let searchValue = value.toUpperCase();
    let arr = [];
    let li = data.colors;
    for (let i = 0; i < li.length; i++) {
      let item = li[i];
      if (item.toUpperCase().indexOf(searchValue) > -1) {
        arr.push(item);
      }
    }
    return arr.sort();
  };
  const manipulateDesiredOption = (value) => {
    if (value === "") {
      setColorToShow(totalData);
    }
    let arr = getPossibleOption(value).sort();
    setTotalData(arr);
    setColorToShow(arr.slice(0, maxResults));
    setOptionToVisible(maxResults);
  };

  const debounceForInputChange = useCallback(
    debounce((val) => {
      manipulateDesiredOption(val);
    }, debounceDelayTime),
    []
  );

  const handleInputChange = (event) => {
    setInputVal(event.target.value);
    debounceForInputChange(event.target.value);
  };

  const handleOptionClick = (color) => {
    setInputVal(color);
    manipulateDesiredOption(color);
  };

  const handleScroll = () => {
    if (
      Math.ceil(allOptions.current.scrollTop) +
        allOptions.current.clientHeight >=
      allOptions.current.scrollHeight
    ) {
      setColorToShow(totalData.slice(0, optionToVisible + maxResults));
      setOptionToVisible(optionToVisible + maxResults);
    }
  };

  const handleBlur = () => {
    setShowOption(false);
    let arr = getPossibleOption(inputVal);
    if (arr.length === 0) {
      setInputVal("");
    }
  };

  const handleFocus = () => {
    setShowOption(true);
    if (inputVal === "") {
      setInputVal("");
      manipulateDesiredOption("");
    }
  };

  return (
    <>
      <div className="autocomplete">
        <input
          type="text"
          placeholder="Please Type Color..."
          onChange={handleInputChange}
          value={inputVal}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {showOption && (
          <div className="allOption" ref={allOptions} onScroll={handleScroll}>
            {colorToShow.map((color, id) => (
              <div
                className={
                  inputVal.toUpperCase() === color.toUpperCase()
                    ? "highlighted"
                    : "notHighlighted"
                }
                key={id}
                onMouseDown={(e) => handleOptionClick(color, e)}
              >
                {color}
              </div>
            ))}
            {colorToShow.length === 0 && (
              <div className="noMatch">No Matches</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

AutoComplete.propTypes = {
  data: PropTypes.object,
  maxResults: PropTypes.number,
  debounceDelayTime: PropTypes.number,
};

AutoComplete.defaultProps = {
  data: { colors: [] },
  maxResults: 10,
  debounceDelayTime: 1000,
};

export default React.memo(AutoComplete);
