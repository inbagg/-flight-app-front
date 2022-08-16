import React, { useState, useEffect } from "react";
import "./../scss/Home.scss";
import { CONSTANT } from "./../CONSTANT";
import FlightCard from "../components/FlightCard";
import { axiosInstance } from "../axiosApi";

export default function Home() {
  useEffect(() => {
    fetchCountries();
    fetchFlights();
  }, []);
  const __init = {
    origin_Country: "",
    destination_Country: "",
    departure_Time: "",
    landing_Time: "",
  };
  const [data, setData] = useState(__init);
  const changeData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const [flights, setFlights] = useState([]);
  const [countries, setCountries] = useState([]);

  const fetchFlights = async (filter = data) => {
    await axiosInstance
      .post(`api/filter-flights/`, filter)
      .then((response) => {
        setFlights(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchCountries = async () => {
    await axiosInstance
      .get(`api/countries`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const applyFilters = async () => {
    fetchFlights();
    document.getElementById("allFlights").scrollIntoView();
  };

  return (
    <div className="__Home">
      <div className="fit-with-navbar homepage">
        <div className="search">
          <div className="row my-5 center-in-there">
            <div className="col-auto center-in-there">
              <span className="fs-4 text-light">Find me a flight from</span>
            </div>
            <div className="col-lg-3 col-sm-12 center-in-there transparent-me">
              <div className="custom-input input-group">
                <select
                  className="form-select form-control"
                  placeholder="From"
                  name="origin_Country"
                  onChange={changeData}
                  value={data.origin_Country}
                >
                  <option value="" selected>
                    Everywhere
                  </option>{" "}
                  {countries.map((country, index) => {
                    return (
                      <option value={country.id} key={index}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="col-auto center-in-there">
              <span className="fs-4 text-light">to</span>
            </div>
            <div className="col-lg-3 col-sm-12 center-in-there transparent-me">
              <div className="custom-input input-group">
                <select
                  className="form-select form-control"
                  placeholder="To"
                  name="destination_Country"
                  onChange={changeData}
                  value={data.destination_Country}
                >
                  <option value="" selected>
                    Everywhere
                  </option>{" "}
                  {countries.map((country, index) => {
                    return (
                      <option value={country.id} key={index}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="row my-5 center-in-there">
            <div className="col-auto center-in-there">
              <span className="fs-4 text-light">I prefer departure on</span>
            </div>
            <div className="col-lg-3 col-sm-12 center-in-there transparent-me">
              <div className="custom-input input-group">
                <input
                  type="datetime-local"
                  className="form-control"
                  placeholder="Departure"
                  name="departure_Time"
                  onChange={changeData}
                  value={data.departure_Time}
                />
              </div>
            </div>
            <div className="col-auto center-in-there">
              <span className="fs-4 text-light">and landing on</span>
            </div>
            <div className="col-lg-3 col-sm-12 center-in-there transparent-me">
              <div className="custom-input input-group">
                <input
                  type="datetime-local"
                  className="form-control"
                  placeholder="Landing"
                  name="landing_Time"
                  onChange={changeData}
                  value={data.landing_Time}
                />
              </div>
            </div>
          </div>
          <div className="row my-5 center-in-there">
            <div className="col-auto me-4 center-in-there">
              <span
                className="fs-4 text-light fw-bold flow-success"
                onClick={applyFilters}
              >
                Apply filters
              </span>
            </div>
            <div className="col-auto me-4 center-in-there">
              <span
                className="fs-4 text-light fw-bold flow-danger"
                onClick={() => {
                  setData(__init);
                  fetchFlights(__init);
                }}
              >
                Reset filters
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="row w-100 center-in-there" id="allFlights">
        <div className="row d-flex center-in-there p-5" style={{width:"80%"}}>
          {flights.length > 0 ? (
            flights.map((flight, index) => {
              return (
                <div className="col-lg-3 col-sm-12 col-md-4 my-3">
                  <FlightCard flight={flight} index={index} key={index} />
                </div>
              );
            })
          ) : (
            <span className="text-light">No flights available right now.</span>
          )}
        </div>
      </div>
    </div>
  );
}
