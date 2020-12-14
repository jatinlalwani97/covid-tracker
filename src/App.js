import React,{useState, useEffect} from "react";
import {Card,MenuItem,FormControl,Select, CardContent} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from './Table';
import LineGraph from "./LineGraph";
import './App.css';
import {sortData, prettyPrintStat} from "./utils";
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState(['USA','UK','INDIA']);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat:34.80746, lng:-40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then(data=>{
      setCountryInfo(data);
    });
  },[]);

  useEffect(()=>{
    // async -> send a request , wait for it, do something
    const getCountriesData= async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>
      {
        const countries = data.map((country)=>
        ({
          name: country.country,
          value:country.countryInfo.iso2
        })
        );
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  },[]);

  const onCountryChange=async (e)=>{
    const countryCode = e.target.value;
    console.log(countryCode);
    const url = 
    countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then((response)=>response.json())
    .then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  };
  console.log("Country Info>>>>>",countryInfo);
  

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
          <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country)=>{
              return(
              <MenuItem value={country.value}>{country.name}</MenuItem>)  
            })
            }
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
            <InfoBox title="Coronavirus Cases" onClick={(e)=> setCasesType('cases')} cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
            <InfoBox title="Recovered" onClick={(e)=> setCasesType('recovered')} cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
            <InfoBox title="Deaths" onClick={(e)=> setCasesType('deaths')} cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
      </div>

      <Map 
        center={mapCenter}
        zoom={mapZoom}
        countries={mapCountries}
        casesType={casesType}
      />
      </div>

      <Card className="app__right">
            <CardContent>
              <h3>Live cases by country</h3>
              <Table countries={tableData} />
              <h3>Worldwide new cases {casesType}</h3>
              <LineGraph casesType={casesType} />
            </CardContent>
      </Card>
    </div>

  );
}

export default App;
