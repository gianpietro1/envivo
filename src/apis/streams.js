import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_APIHOST_JSON,
  //baseURL: "http://localhost:3001",
});
