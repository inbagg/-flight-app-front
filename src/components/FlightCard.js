import React, { useEffect, useState } from "react";
import "./../scss/FlightCard.scss";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

export default function FlightCard(props) {
  if (!props.flight) return;

  return (
    <Link to={`/details/${props.flight.id}`} className="__FlightCard">
      <div className={`card auction`}>
        <img
          src={
            props.flight.image !== ""
              ? props.flight.image
              : `https://picsum.photos/600?random=${parseInt(props.index) + 1}`
          }
          className="card-img-top"
          alt={props.flight.origin_Country.name}
        />
        <span className="highlight">
          Explore {props.flight.destination_Country.name}
        </span>
        <div className="card-body">
          <div className="row1 d-flex align-items-center">
            <div className="col-4">
              <b className="text-success" data-tip data-for={`O${props.index}`}>
                {props.flight.origin_Country.name}
              </b>
              <ReactTooltip
                id={`O${props.index}`}
                type="success"
                effect="solid"
              >
                <span>Departure on {new Date(props.flight.departure_Time).toUTCString()}</span>
              </ReactTooltip>
            </div>
            <div className="col-4">
              <span className={`title fw-bold text-muted`}>
                <img
                  src="https://www.pngimages.pics/images/quotes/english/general/black-plane-png-transparent-background-52650-287215.png"
                  className="small-airplane"
                />
              </span>
            </div>
            <div className="col-4">
              <b className="text-danger" data-tip data-for={`D${props.index}`}>
                {props.flight.destination_Country.name}
              </b>
              <ReactTooltip id={`D${props.index}`} type="error" effect="solid">
                <span>Landing on {new Date(props.flight.landing_Time).toUTCString()}</span>
              </ReactTooltip>
            </div>
          </div>
          <div className="row1 my-2">
            <span className="text-muted">
              Only <b>{props.flight.remaining_Tickets}</b> tickets left
            </span>
          </div>
          <div className=" button">
            <span className="text-danger fw-bold fs-5">
              {props.flight.price}$
            </span>
            <span className="timeLeft">Ticket per person</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
