import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./../scss/Details.scss";
import { axiosInstance } from "../axiosApi";
import UserData from "./../components/UserData";
import { checkLoginFromNonLoginNormal } from "../CONSTANT";
import ReactTooltip from "react-tooltip";

export default function Cart() {
  const { session, setSession } = useContext(UserData);
  const navigate = useNavigate();
  useEffect(() => {
    fetchFlights();
    setCart(JSON.parse(localStorage.getItem("myCart")) ?? []);
  }, []);
  const [cart, setCart] = useState([]);
  const [flights, setFlights] = useState([]);
  const fetchFlights = async () => {
    await axiosInstance
      .get(`api/flights`)
      .then((response) => {
        if (response.data.length > 0) {
          setFlights(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getTotal = () => {
    let total = 0;
    cart.map((id, one) => {
      let myFlight = flights.filter((flight, two) => {
        return id.id === flight.id;
      });
      if (myFlight.length > 0) {
        total += parseInt(myFlight[0].price) * parseInt(id.quantity);
      }
    });
    return total;
  };

  const checkout = async () => {
    cart.map(async (id, one) => {
      await axiosInstance
        .post(`api/create-ticket/`, {
          flight: id.id,
          customer: session.personal?.id,
          quantity: parseInt(id.quantity),
        })
        .then((response) => {})
        .catch((error) => {
          console.error(error);
        });
    });
    localStorage.removeItem("myCart");
    navigate("/myTickets");
  };

  return (
    <div className="fit-with-navbar __Cart">
      <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div className="card">
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-lg-12">
                      <h5 className="mb-3">
                        Your Cart (
                        <span className="text-primary">
                          {cart?.reduce(function (sum, current) {
                            return parseInt(sum) + parseInt(current.quantity);
                          }, 0)}{" "}
                          tickets
                        </span>
                        )
                      </h5>
                      {cart.map((id, one) => {
                        let myFlight = flights.filter((flight, two) => {
                          return id.id === flight.id;
                        });
                        myFlight = myFlight.length > 0 ? myFlight[0] : null;
                        return (
                          <div className="card mb-3" key={one}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between">
                                <div className="d-flex flex-row align-items-center">
                                  <div>
                                    <img
                                      src={
                                        myFlight?.image !== ""
                                          ? myFlight?.image
                                          : `https://picsum.photos/600?random=${
                                              parseInt(one) + 1
                                            }`
                                      }
                                      className="img-fluid rounded-3"
                                      alt="Shopping item"
                                      style={{ width: "65px" }}
                                    />
                                  </div>
                                  <div className="ms-5 d-flex flex-row">
                                    <h5 className="m-0 p-0">
                                      <span className={`title text-muted`}>
                                        From{" "}
                                        <b
                                          className="text-success"
                                          data-tip
                                          data-for={`O${one}`}
                                        >
                                          {myFlight?.origin_Country.name}
                                        </b>{" "}
                                        to{" "}
                                        <b
                                          className="text-danger"
                                          data-tip
                                          data-for={`D${one}`}
                                        >
                                          {myFlight?.destination_Country.name}
                                        </b>
                                      </span>
                                      <ReactTooltip
                                        id={`O${one}`}
                                        type="success"
                                        effect="solid"
                                      >
                                        <span>
                                          Departure on{" "}
                                          {new Date(
                                            myFlight?.departure_Time
                                          ).toUTCString()}
                                        </span>
                                      </ReactTooltip>
                                      <ReactTooltip
                                        id={`D${one}`}
                                        type="success"
                                        effect="solid"
                                      >
                                        <span>
                                          Landing on{" "}
                                          {new Date(
                                            myFlight?.landing_Time
                                          ).toUTCString()}
                                        </span>
                                      </ReactTooltip>
                                    </h5>
                                  </div>
                                </div>
                                <div className="d-flex flex-row align-items-center">
                                  <div style={{ width: "50px" }}>
                                    <h5
                                      className="fw-normal mb-0"
                                      data-tip
                                      data-for={`quantity${one}`}
                                    >
                                      {id.quantity}
                                    </h5>
                                    <ReactTooltip
                                      id={`quantity${one}`}
                                      type="success"
                                      effect="solid"
                                    >
                                      <span>Ticket Quantity</span>
                                    </ReactTooltip>
                                  </div>
                                  <div style={{ width: "80px" }}>
                                    <h5
                                      className="mb-0 text-danger"
                                      data-tip
                                      data-for={`price${one}`}
                                    >
                                      ${myFlight?.price}
                                    </h5>
                                    <ReactTooltip
                                      id={`price${one}`}
                                      type="success"
                                      effect="solid"
                                    >
                                      <span>Per Ticket Price</span>
                                    </ReactTooltip>
                                  </div>

                                  <div style={{ width: "80px" }}>
                                    <h5
                                      className="mb-0 text-danger"
                                      data-tip
                                      data-for={`subprice${one}`}
                                    >
                                      $
                                      {parseInt(myFlight?.price) *
                                        parseInt(id.quantity)}
                                    </h5>
                                    <ReactTooltip
                                      id={`subprice${one}`}
                                      type="success"
                                      effect="solid"
                                    >
                                      <span>Total Ticket Price</span>
                                    </ReactTooltip>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="col-lg-12">
                      <div className="card rounded-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Name</p>
                            <p className="mb-2">
                              {session.personal?.username ?? "-"}
                            </p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Email</p>
                            <p className="mb-2">
                              {session.personal?.email ?? "-"}
                            </p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Address</p>
                            <p className="mb-2">
                              {session.personal?.address ?? "-"}
                            </p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Phone Number</p>
                            <p className="mb-2">
                              {session.personal?.phone_no ?? "-"}
                            </p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Subtotal</p>
                            <p className="mb-2">${getTotal()}.00</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Shipping</p>
                            <p className="mb-2">$20.00</p>
                          </div>
                          <div className="d-flex justify-content-between mb-4">
                            <p className="mb-2">Total(Incl. taxes)</p>
                            <p className="mb-2">${getTotal() + 20}.00</p>
                          </div>
                          <div className="w-100 mt-1 cartButton">
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{
                                padding: "12px 15px",
                              }}
                              disabled={session.personal?.role === ""}
                              onClick={checkout}
                            >
                              {session.personal?.role === ""
                                ? "Login to Checkout"
                                : "Checkout"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
