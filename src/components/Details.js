import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../scss/Details.scss";
import { axiosInstance } from "../axiosApi";
import loremGenerator from "dummy-text-generator";
import UserData from "./../components/UserData";
import { generateParagraph } from "dummy-text-generator";

const para = loremGenerator.generateParagraph(5, 20);

export default function Details() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { session, setSession } = useContext(UserData);
  useEffect(() => {
    if (id) {
      fetchFlight(id);
      setCart(JSON.parse(localStorage.getItem("myCart")) ?? []);
    } else {
    }
  }, []);

  const [flight, setFlight] = useState({});
  const [cart, setCart] = useState(null);

  const fetchFlight = async (id = id) => {
    await axiosInstance
      .get(`api/flights/${id}`)
      .then((response) => {
        setFlight(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addToCart = (e) => {
    let id = e.target.getAttribute("data-id");
    localStorage.setItem(
      "myCart",
      JSON.stringify([
        ...cart,
        {
          id: parseInt(id),
          quantity: quantity,
        },
      ])
    );
    e.target.innerHTML = "Added To Cart";
  };

  const [quantity, setQuantity] = useState(1);

  return (
    <div className="__Details fit-with-navbar">
      {flight && (
        <div className="row p-4">
          <div className="col-lg-8 col-md-8 col-sm-12">
            <img
              src={
                flight?.image !== ""
                  ? flight?.image
                  : `https://picsum.photos/600?random=${200}`
              }
              className="large-img"
            />
            <div className="py-2 w-100 d-block"></div>
            <div className="row my-4">
              <div className="col-4">
                {" "}
                <span className="h5 text-muted">Airline</span>
                <p className="text-dark">
                  <span className="text-success">
                    {flight?.airline_Company?.name}
                  </span>
                  <br />
                  <span className="text-muted">
                    {flight?.airline_Company?.country?.name}
                  </span>
                </p>
              </div>
              <div className="col-4">
                {" "}
                <span className="h5 text-muted">Origin</span>
                <p className="text-dark">
                  <span className="text-success">
                    {flight?.origin_Country?.name}
                  </span>
                  <br />
                  <span className="text-muted">
                    {new Date(flight?.departure_Time).toUTCString()}
                  </span>
                </p>
              </div>
              <div className="col-4">
                {" "}
                <span className="h5 text-muted">Destination</span>
                <p className="text-dark">
                  <span className="text-danger">
                    {flight?.destination_Country?.name}
                  </span>
                  <br />
                  <span className="text-muted">
                    {new Date(flight?.landing_Time).toUTCString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="row my-4">
              <span className="h5 text-muted">Description</span>
              <p className="text-dark">{para}</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <div className="row">
              <span className="h5 text-muted">Number of Tickets</span>
              <div className="row">
                <div className="custom-input input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                    name="quantity"
                    onChange={(e) => {
                      if (
                        parseInt(e.target.value) > 0 &&
                        parseInt(flight?.remaining_Tickets) -
                          parseInt(e.target.value) >=
                          0
                      ) {
                        setQuantity(e.target.value);
                      }
                    }}
                    value={quantity}
                  />
                </div>
                <div className="w-100 mt-1 cartButton">
                  <button
                    type="button"
                    className={`btn btn-${
                      flight?.remaining_Tickets < 1 ? "warning" : "primary"
                    }`}
                    style={{
                      padding: "12px 15px",
                    }}
                    data-id={flight?.id}
                    onClick={addToCart}
                    disabled={
                      flight?.remaining_Tickets < 1 ||
                      !cart ||
                      (cart &&
                        cart
                          .map((a, i) => {
                            return a.id;
                          })
                          .includes(flight?.id)) ||
                      session.personal?.role === "airlineOwner"
                    }
                  >
                    {cart &&
                    cart
                      .map((a, i) => {
                        return a.id;
                      })
                      .includes(flight?.id)
                      ? "Added to Cart"
                      : flight?.remaining_Tickets < 1
                      ? "Flight Full"
                      : session.personal?.role === "airlineOwner"
                      ? "You're Airline Owner"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
            <div className="row my-4">
              <span className="h5 text-muted">Price</span>
              <p className="text-dark">
                <span className="text-danger fw-bold fs-3">
                  {flight?.price}$
                </span>
              </p>
            </div>

            <div className="row my-4">
              <span className="h5 text-muted">Tickets Remaining</span>
              <p className="text-dark">
                <span className="text-danger fw-bold fs-3">
                  {flight?.remaining_Tickets}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
