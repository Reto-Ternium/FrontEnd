import { Autocomplete } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Status.scss";

export default function Status() {
  const [zone, setZone] = useState("");
  const [concentracion, setConcentracion] = useState("50");

  const changeZone = (event) => {
    setZone(event.target.textContent);
    console.log(event.target.textContent);
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw", backgroundColor: "#f2efeb" }}
    >
      <div className="search">
        <div className="searchInput">
          <Autocomplete
            options={top100Films}
            getOptionLabel={(opt) => opt.title}
            onChange={changeZone}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <input
                  type="text"
                  {...params.inputProps}
                  placeholder={"Zona 134"}
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
              <div className="section__tag--number">200.3 g/m3</div>
            </div>
          </div>
          <div className="section2">section 2</div>
        </div>
        <div className="section3">
          <BasicTable data={[rows]} />
        </div>
      </div>
    </div>
  );
}

function BasicTable(data) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const rows = [
  { name: "Frozen yoghurt", n1: 159, n2: 6.0, n3: 24, n4: 4.0 },
  { name: "Frozen yoghurt", n1: 159, n2: 6.0, n3: 24, n4: 4.0 },
  { name: "Frozen yoghurt", n1: 159, n2: 6.0, n3: 24, n4: 4.0 },
  { name: "Frozen yoghurt", n1: 159, n2: 6.0, n3: 24, n4: 4.0 },
  { name: "Frozen yoghurt", n1: 159, n2: 6.0, n3: 24, n4: 4.0 },
];

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: "Zona 1", year: 1994 },
  { title: "Zona 2", year: 1994 },
  { title: "Zona 3", year: 1994 },
  { title: "Zona 4", year: 1994 },
  { title: "Zona 5", year: 1994 },
  { title: "Zona 6", year: 1994 },
  { title: "Zona 7", year: 1994 },
  { title: "Zona 8", year: 1994 },
  { title: "Zona 9", year: 1994 },
  { title: "Zona 10", year: 1994 },
  { title: "Zona 11", year: 1994 },
  { title: "Zona 12", year: 1994 },
];
