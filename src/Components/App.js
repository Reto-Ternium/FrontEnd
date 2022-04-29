import * as React from "react";
import Status from "./Status/Status";
import { Drawer } from "@mui/material";
import Mapa from "../assets/Mapa.png";
import Logo from "../assets/logo.png";
import { ReactComponent as LeftArrow } from "../assets/LeftArrow.svg";
import { ReactComponent as RightArrow } from "../assets/RightArrow.svg";
import Unity, { UnityContext } from "react-unity-webgl";

import "./App.scss";

const unityContext = new UnityContext({
  loaderUrl: "Build/Downloads.loader.js",
  dataUrl: "Build/Downloads.data",
  frameworkUrl: "Build/Downloads.framework.js",
  codeUrl: "Build/Downloads.wasm",
});

export default function TemporaryDrawer() {
  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    setState(open);
  };
  return (
    <div className="imageContainer">
      <img className="Logo" src={Logo} alt={"Logo Ternium"} />
      <LeftArrow className="slideIcon" onClick={toggleDrawer(true)} />
      <div className="Image">
        <Unity unityContext={unityContext} />;
      </div>
      {/* <img className="Image" src={Mapa} alt={"Mapa"} /> */}
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
