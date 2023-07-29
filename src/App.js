import React from "react";
import data from "./data.json";
import "./App.css";
import AutoComplete from "./AutoComplete";

const App = () => {
  return (
    <div className="app">
      <AutoComplete data={data} maxResults={10} debounceDelayTime={5000} />
      <AutoComplete data={data} maxResults={5} />
      <AutoComplete data={data} />
    </div>
  );
};

export default App;
