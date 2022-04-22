import * as React from "react";
import Status from "./Status/Status";
import { Drawer } from "@mui/material";
import Mapa from "../assets/Mapa.png";
import Logo from "../assets/logo.png";
import { ReactComponent as LeftArrow } from "../assets/LeftArrow.svg";
import { ReactComponent as RightArrow } from "../assets/RightArrow.svg";

import "./App.scss";

export default function TemporaryDrawer() {
  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    setState(open);
  };
  return (
    <div className="imageContainer">
      <img className="Logo" src={Logo} alt={"Logo Ternium"} />
      <LeftArrow className="slideIcon" onClick={toggleDrawer(true)} />
      <img className="Image" src={Mapa} alt={"Mapa"} />
      <Drawer anchor={"right"} open={state} onClose={toggleDrawer(false)}>
        <RightArrow
          className="slideIcon slideIcon__left"
          onClick={toggleDrawer(false)}
        />
        <Status />
      </Drawer>
    </div>
  );
}
