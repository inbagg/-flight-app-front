import React, { useState, useEffect, useContext } from "react";
import "./../scss/MyFlights.scss";
import { useNavigate } from "react-router-dom";
import UserData from "./../components/UserData";
import { axiosInstance } from "../axiosApi";
import {
  checkLoginFromNonLoginNormal,
  setMessage,
  resetMessage,
} from "../CONSTANT";

export default function MyTickets() {
  let navigate = useNavigate();
  const { session, setSession } = useContext(UserData);
  useEffect(() => {
    if (checkLoginFromNonLoginNormal()) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (session.personal?.id !== "") {
      fetchFlights(session.personal?.id);
    }
  }, [session]);

  const [tickets, setTickets] = useState([]);

  const fetchFlights = async (myID) => {
    await axiosInstance
      .get(`api/tickets-by-user/${myID}`)
      .then((response) => {
        if (response.data.length > 0) {
          setTickets(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="fit-with-navbar __MyFlights">
      <span className="display-5 mt-4 mb-3 w-100 d-block">
        Past Ticket Purchases
      </span>
      <div className="w-100 row">
        <table className="table table-responsive">
          <thead>
            <tr>
              <th scope="col">Quantity</th>
              <th scope="col">Paid</th>
              <th scope="col">Origin</th>
              <th scope="col">Destination</th>
              <th scope="col">Departure</th>
              <th scope="col">Landing</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => {
              return (
                <tr key={index}>
                  <td>{ticket?.quantity}</td>
                  <td>
                    {parseInt(ticket?.quantity) *
                      parseInt(ticket?.flight?.price)}$
                  </td>
                  <td>{ticket?.flight?.origin_Country.name}</td>
                  <td>{ticket?.flight?.destination_Country.name}</td>
                  <td>
                    {new Date(ticket?.flight?.departure_Time).toUTCString()}
                  </td>
                  <td>
                    {new Date(ticket?.flight?.landing_Time).toUTCString()}
                  </td>
                  <td>{ticket?.flight?.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
