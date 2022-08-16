import React from "react";

const UserData = React.createContext({
  session: {
    access_token: "",
    personal: {
      id: "",
      name: "",
      email: "",
      username: "",
      role: "",
      first_name: "",
      last_name: "",
      address: "",
      phone_no: "",
    },
    isLoggedIn: false,
  },
  setSession: () => {},
});

export default UserData;
