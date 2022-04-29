import { Autocomplete } from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import "./Status.scss";

import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function Status() {
  const [zone, setZone] = useState(1);
  const [concentracion, setConcentracion] = useState("");
  const [zoneData, setZoneData] = useState([]);
  const [graphLabels, setGraphLabels] = useState([]);
  const [graphData, setGraphData] = useState([]);

  const changeZone = (event) => {
    var values = event.target.textContent.split(" ");
    setZone(values[1]);
  };

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    getInfo();
  }, [zone]);

  const realDate = (fecha) => {
    var localDate = new Date(fecha);
    localDate = localDate.toString();
    localDate = localDate.substring(
      localDate.indexOf(":") - 2,
      localDate.lastIndexOf(":")
    );
    return localDate;
  };

  const getInfo = async () => {
    await axios
      .get("http://localhost:3001/registros_ultima_hora", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const ing = normalizedInfo(response.data.results, zone);
        let newArrLabels = [],
          newArrData = [];
        setZoneData(ing);
        let i,
          avgCon = 0;
        for (i = 0; i < ing.length; i++) {
          avgCon = avgCon + ing[i].Con_gas;
          newArrLabels.push(realDate(ing[i].F_Emision));
          newArrData.push(ing[i].Con_gas);
        }
        avgCon = avgCon / ing.length;
        setConcentracion(avgCon);
        setGraphData(newArrData);
        setGraphLabels(newArrLabels);
      });
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw", backgroundColor: "#f2efeb" }}
    >
      <div className="search">
        <div className="searchInput">
          <Autocomplete
            options={top100Films()}
            getOptionLabel={(opt) => opt.title}
            onChange={changeZone}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <input
                  type="text"
                  {...params.inputProps}
                  placeholder={"Zona 1"}
                  autoFocus={true}
                />
              </div>
            )}
          ></Autocomplete>
        </div>
      </div>
      <div className="content">
        <div className="left-content">
          <div className="section1">
            <div className="section__tag">
              <div className="section__tag--title">Riesgo:</div>
              <div className="section__tag--bar">
                <div
                  className={`bar--item ${
                    concentracion >= 0 && concentracion < 50
                      ? "bar--active"
                      : "bar--inactive"
                  }`}
                  style={{ backgroundColor: "green" }}
                ></div>
                <div
                  className={`bar--item ${
                    concentracion >= 50 && concentracion < 75
                      ? "bar--active"
                      : "bar--inactive"
                  }`}
                  style={{ backgroundColor: "yellow" }}
                ></div>
                <div
                  className={`bar--item ${
                    concentracion >= 75 && concentracion < 200
                      ? "bar--active"
                      : "bar--inactive"
                  }`}
                  style={{ backgroundColor: "orange" }}
                ></div>
                <div
                  className={`bar--item ${
                    concentracion >= 200 && concentracion < 1000
                      ? "bar--active"
                      : "bar--inactive"
                  }`}
                  style={{ backgroundColor: "red" }}
                ></div>
                <div
                  className={`bar--item ${
                    concentracion > 1000 ? "bar--active" : "bar--inactive"
                  }`}
                  style={{ backgroundColor: "purple" }}
                ></div>
              </div>
            </div>
            <div className="section__tag">
              <div className="section__tag--title">Concentración Prom:</div>
              <div className="section__tag--number">{concentracion} g/m3</div>
            </div>
          </div>
          <div className="section2">
            <Line
              datasetIdKey="id"
              data={{
                labels: graphLabels,
                datasets: [
                  {
                    id: 1,
                    label: "Concentración Promedio",
                    data: graphData,
                    backgroundColor: "orange",
                    borderColor: "orange",
                    borderWidth: 3,
                    pointBackgroundColor: "orange",
                    pointRadius: 4,
                    pointHoverRadius: 10,
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="section3">
          <BasicTable data={zoneData} />
        </div>
      </div>
    </div>
  );
}

function BasicTable(data) {
  let iter = 0;
  const updateCell = () => {
    iter = iter + 1;
    return `tablecle${iter}`;
  };
  const realDate = (fecha) => {
    var localDate = new Date(fecha);
    localDate = localDate.toString();
    localDate = localDate.substring(
      localDate.indexOf(":") - 2,
      localDate.lastIndexOf(":")
    );
    return localDate;
  };
  const renderCells = () => {
    if (data) {
      return (
        <TableBody>
          {data.data.map((row) => (
            <TableRow
              key={updateCell()}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center" className="table--text">
                {row.Sensor_ID}
              </TableCell>
              <TableCell align="center" className="table--text">
                {row.Con_gas}
              </TableCell>
              <TableCell align="center" className="table--text">
                {realDate(row.F_Emision)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    return <></>;
  };
  return (
    <TableContainer sx={{ maxHeight: 490 }}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className="table--title">
              Sensor
            </TableCell>
            <TableCell align="center" className="table--title">
              Medición
            </TableCell>
            <TableCell align="center" className="table--title">
              Hora
            </TableCell>
          </TableRow>
        </TableHead>
        {renderCells()}
      </Table>
    </TableContainer>
  );
}

function normalizedInfo(data, zonaInfo) {
  let coordY = [
    { upper: 715301799, lower: 715563923 },
    { upper: 715563923, lower: 715826048 },
    { upper: 715826048, lower: 716088173 },
    { upper: 716088173, lower: 716350298 },
    { upper: 716350298, lower: 716612422 },
    { upper: 716612422, lower: 716874547 },
    { upper: 716874547, lower: 717136672 },
    { upper: 717136672, lower: 717398797 },
    { upper: 717398797, lower: 717660922 },
    { upper: 717660922, lower: 717923046 },
    { upper: 717923046, lower: 718185171 },
    { upper: 718185171, lower: 718447296 },
    { upper: 718447296, lower: 718709421 },
    { upper: 718709421, lower: 718971545 },
    { upper: 718971545, lower: 719233670 },
    { upper: 719233670, lower: 719495795 },
    { upper: 719495795, lower: 719757920 },
    { upper: 719757920, lower: 720020045 },
    { upper: 720020045, lower: 720282169 },
    { upper: 720282169, lower: 720544294 },
    { upper: 720544294, lower: 720806419 },
    { upper: 720806419, lower: 721068544 },
    { upper: 721068544, lower: 721330668 },
    { upper: 721330668, lower: 721592793 },
    { upper: 721592793, lower: 721854918 },
    { upper: 721854918, lower: 722117043 },
    { upper: 722117043, lower: 722379168 },
    { upper: 722379168, lower: 722641292 },
    { upper: 722641292, lower: 722903417 },
    { upper: 722903417, lower: 723165542 },
    { upper: 723165542, lower: 723427667 },
    { upper: 723427667, lower: 723689791 },
    { upper: 723689791, lower: 723951916 },
    { upper: 723951916, lower: 724214041 },
    { upper: 724214041, lower: 724476166 },
    { upper: 724476166, lower: 724738290 },
    { upper: 724738290, lower: 725000415 },
    { upper: 725000415, lower: 725262540 },
    { upper: 725262540, lower: 725524665 },
    { upper: 725524665, lower: 725786790 },
    { upper: 725786790, lower: 726048914 },
    { upper: 726048914, lower: 726311039 },
    { upper: 726311039, lower: 726573164 },
    { upper: 726573164, lower: 726835289 },
    { upper: 726835289, lower: 727097413 },
    { upper: 727097413, lower: 727359538 },
    { upper: 727359538, lower: 727621663 },
    { upper: 727621663, lower: 727883788 },
    { upper: 727883788, lower: 728145913 },
    { upper: 728145913, lower: 728408037 },
  ];

  let coordX = [
    { upper: -307552936, lower: -307835379 },
    { upper: -307270493, lower: -307552936 },
    { upper: -306988050, lower: -307270493 },
    { upper: -306705607, lower: -306988050 },
    { upper: -306423164, lower: -306705607 },
    { upper: -306140721, lower: -306423164 },
    { upper: -305858278, lower: -306140721 },
    { upper: -305575835, lower: -305858278 },
    { upper: -305293392, lower: -305575835 },
    { upper: -305010949, lower: -305293392 },
    { upper: -304728506, lower: -305010949 },
    { upper: -304446063, lower: -304728506 },
    { upper: -304163620, lower: -304446063 },
    { upper: -303881177, lower: -304163620 },
    { upper: -303598734, lower: -303881177 },
    { upper: -303316291, lower: -303598734 },
    { upper: -303033848, lower: -303316291 }, // Cuarto spot
    { upper: -302751405, lower: -303033848 }, // Tercer spot
    { upper: -302468962, lower: -302751405 }, // Segunda spot
    { upper: -302186519, lower: -302468962 }, // Aquí empezamos primera spot
    { upper: -301904076, lower: -302186519 }, // Segunda spot
    { upper: -301621633, lower: -301904076 }, // Tercera spot
    { upper: -301339190, lower: -301621633 }, // Cuarto spot
    { upper: -301056747, lower: -301339190 }, // Quinto spot
    { upper: -300774304, lower: -301056747 },
    { upper: -300491861, lower: -300774304 },
    { upper: -300209418, lower: -300491861 },
    { upper: -299926975, lower: -300209418 },
    { upper: -299644532, lower: -299926975 },
    { upper: -299362089, lower: -299644532 },
    { upper: -299079647, lower: -299362089 },
    { upper: -298797204, lower: -299079647 },
    { upper: -298514761, lower: -298797204 },
    { upper: -298232318, lower: -298514761 },
    { upper: -297949875, lower: -298232318 },
    { upper: -297667432, lower: -297949875 },
    { upper: -297384989, lower: -297667432 },
    { upper: -297102546, lower: -297384989 },
    { upper: -296820103, lower: -297102546 },
    { upper: -296537660, lower: -296820103 },
    { upper: -296255217, lower: -296537660 },
    { upper: -295972774, lower: -296255217 },
    { upper: -295690331, lower: -295972774 },
    { upper: -295407888, lower: -295690331 },
    { upper: -295125445, lower: -295407888 },
    { upper: -294843002, lower: -295125445 },
    { upper: -294560559, lower: -294843002 },
    { upper: -294278116, lower: -294560559 },
    { upper: -293995673, lower: -294278116 },
    { upper: -293713230, lower: -293995673 },
  ];

  let posX = 0;
  let posY = 0;
  let iter = 0;
  let zone = 0;
  let newData = [];

  data.map((item) => {
    for (iter = 0; iter < 50; iter++) {
      if (
        item.Longitud <= coordX[iter].upper &&
        item.Longitud > coordX[iter].lower
      ) {
        posY = iter;
      }
    }

    for (iter = 0; iter < 50; iter++) {
      if (
        item.Latitud >= coordY[iter].upper &&
        item.Latitud < coordY[iter].lower
      ) {
        posX = iter;
      }
    }

    zone = (49 - posX) * 50 + posY;
    console.log(item);
    console.log(zone);

    console.log(`PosX = ${49 - posX}`);
    console.log(`PosY = ${posY}`);

    if (zone == zonaInfo) {
      newData.push(item);
    }
  });
  return newData;
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = () => {
  let i;
  let zones = [];
  for (i = 1; i <= 2500; i++) {
    zones.push({ title: `Zona ${i}` });
  }
  return zones;
};
