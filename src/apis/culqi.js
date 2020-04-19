import axios from "axios";

export default axios.create({
  baseURL: "https://api.culqi.com/v2/charges",
});
