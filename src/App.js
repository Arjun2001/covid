import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  Select, Card, CardContent, Button } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import './App.css';
import { sortData, prettyPrintStat } from './util';
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import Atable from "./Atable";
import Footer from "./Footer";


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, settableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 20.5937, lng: 78.9629});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [indiaInfo, setIndiaInfo] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
    fetch("https://covid19-india-adhikansh.herokuapp.com/states")
    .then(response => response.json())
    .then(data => {
      setIndiaInfo(data.state)
    })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);
          setCountries(countries);
          settableData(sortedData);
          setMapCountries(data);
      });
    };
    getCountriesData();
  }, [countries]);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'Worldwide' ? 'https://disease.sh/v3/covid-19/all' :
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
      setCountry(countryCode);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  return (
    <div>
    <div className="app">
    <div className="app_left">
      <div className="app_header">
      <h1>Coivid-19 Tracker</h1>
      <div className="header_right">
      <Button variant="contained" color="primary" href="#india" className="india_button">
        CASES IN INDIA
      </Button>
      <FormControl className="app_dropdown">

        <Select variant="outlined" onChange={onCountryChange} value={country}>
          <MenuItem value="Worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}

        </Select>

      </FormControl>
      </div>
      
      </div>
      <div className="app_stats">
        <InfoBox isRed active={casesType === "cases"} onClick={(e) => setCasesType('cases')} title="CoronaVirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}></InfoBox>
        <InfoBox active={casesType === "recovered"} onClick={(e) => setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}></InfoBox>
        <InfoBox isRed active={casesType === "deaths"} onClick={(e) => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}></InfoBox>
      </div>

      <Map
        casesType = {casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
      />
    </div>
    <div className="app_right">
            <Card>
              <CardContent>
                <h3>Live Cases by Country</h3>
                <Table countries={tableData}></Table>
                <h3>Worlwide New {casesType}</h3>
                <LineGraph casesType={casesType}></LineGraph>
              </CardContent>
            </Card>
      </div>
      
    </div>
    <div id="india">
    <div className="app_header">
      <h1>Coivid-19 Cases In India</h1>
    </div>
    <Atable states={indiaInfo}/>
    </div>
    <Footer />
    </div>
  );
}

export default App;
