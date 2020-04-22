import axios from "axios";

export default axios.create({
  //baseURL: process.env.NODE_ENV.REACT_APP_APIHOST_JSON,
  baseURL: "https://envivo-api.herokuapp.com",
});
