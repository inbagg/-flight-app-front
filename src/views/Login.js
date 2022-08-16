import React, { useState, useEffect } from "react";
import "./../scss/Auth.scss";
import { Link } from "react-router-dom";
import { axiosInstance } from "../axiosApi";
import { useNavigate } from "react-router-dom";
import {
  CONSTANT,
  checkLoginFromLogin,
  setMessage,
  resetMessage,
} from "./../CONSTANT";

function Login(props) {
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromLogin()) {
      navigate("/");
    }
  }, []);

  const __init = {
    username: "",
    password: "",
  };
  const [credentials, setCredentials] = useState(__init);
  const changeCredentials = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (credentials.username !== "") {
      if (credentials.password !== "") {
        await axiosInstance
          .post("auth/token/obtain", credentials)
          .then((response) => {
            if (response.data) {
              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              localStorage.setItem("access_token", response.data.access);
              localStorage.setItem("refresh_token", response.data.refresh);
              localStorage.setItem(
                "loggedin",
                JSON.stringify({
                  data: {
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    username: response.data.username,
                    role: response.data.role,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    signedUpAt: response.data.signedUpAt,
                  },
                })
              );
              navigate("/");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setMessage("Please Enter Password", "danger");
      }
    } else {
      setMessage("Please Enter Username", "danger");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Log In";
  };

  return (
    <>
      <div className="row A__Login" style={{ margin: "0px", padding: "0px" }}>
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="form d-flex flex-column justify-content-center align-items-center">
            <h1 className="mb-5">Log In</h1>
            <div>
              <div className="custom-input input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  name="username"
                  onChange={changeCredentials}
                  value={credentials.username}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value !== "") {
                      login(e);
                    }
                  }}
                />
              </div>
              <div className="custom-input input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  onChange={changeCredentials}
                  value={credentials.password}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value !== "") {
                      login(e);
                    }
                  }}
                />
              </div>
              <p
                className="text-danger p-0 m-0 mb-2"
                id="error"
                style={{ display: "none" }}
              >
                Error
              </p>
              <div className="w-100 mt-1 custom-button">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    padding: "12px 15px",
                  }}
                  onClick={login}
                >
                  Log In
                </button>
              </div>
              <div className="mt-5 d-flex justify-content-center align-items-center">
                <Link to="/">Go Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
