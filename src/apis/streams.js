import axios from "axios";

export default axios.create({
  baseURL: "https://envivo-api.herokuapp.com",
});
