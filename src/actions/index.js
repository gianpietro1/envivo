import streams from "../apis/streams";
import agoraTokens from "../apis/agoraTokens";
import history from "../history";

import {
  SIGN_IN,
  SIGN_OUT,
  CREATE_STREAM,
  FETCH_STREAM,
  FETCH_STREAMS,
  EDIT_STREAM,
  DELETE_STREAM,
  GET_STREAM_TOKEN,
  CREATE_COMMENT,
  FETCH_COMMENTS,
  DELETE_COMMENT,
  INIT_PAYMENT,
  DEACTIVATE_PAYMENT,
  SUBMIT_PAYMENT,
  PROCESS_PAYMENT,
  CREATE_MEDIA,
  SET_STREAM,
  RESET_STREAM,
  TOGGLE_MUTE_AUDIO,
  TOGGLE_MUTE_VIDEO,
} from "./types";

export const signIn = (userId) => {
  return {
    type: SIGN_IN,
    payload: userId,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

export const createStream = (formValues) => async (dispatch, getState) => {
  const { userId } = getState().auth;
  const response = await streams.post("/streams", { ...formValues, userId });
  dispatch({ type: CREATE_STREAM, payload: response.data });
  // Do some programmatic navigation to get the user back to root route
  // We had to migrate from BrowserRouter to (Plain)Router to be able to import our own history
  history.push("/");
};

export const fetchStreams = () => async (dispatch) => {
  const response = await streams.get("/streams");
  dispatch({ type: FETCH_STREAMS, payload: response.data });
};

export const fetchStream = (id) => async (dispatch) => {
  const response = await streams.get(`/streams/${id}`);
  dispatch({ type: FETCH_STREAM, payload: response.data });
};

export const editStream = (id, formValues) => async (dispatch) => {
  // patch instead of pull so partial forms submission do not eliminate other values
  // patch is for some values, put for all values (according to REST conventions)
  const response = await streams.patch(`/streams/${id}`, formValues);
  dispatch({ type: EDIT_STREAM, payload: response.data });
  history.push("/");
};

export const deleteStream = (id) => async (dispatch) => {
  await streams.delete(`/streams/${id}`);
  dispatch({ type: DELETE_STREAM, payload: id });
  history.push("/");
};

export const getStreamToken = (channelName) => async (dispatch) => {
  const response = await agoraTokens.get("/rtcToken", {
    params: { channelName: channelName },
  });
  dispatch({ type: GET_STREAM_TOKEN, payload: response.data.key });
};

export const createComment = (streamId, comment) => async (
  dispatch,
  getState
) => {
  const { userId } = getState().auth;
  const date = new Date();
  const response = await streams.post("/comments", {
    comment,
    userId,
    streamId,
    date,
  });
  dispatch({ type: CREATE_COMMENT, payload: response.data });
};

export const fetchComments = (streamId) => async (dispatch) => {
  const response = await streams.get("/comments", {
    params: {
      streamId,
    },
  });
  dispatch({ type: FETCH_COMMENTS, payload: response.data });
};

export const deleteComment = (id) => async (dispatch) => {
  await streams.delete(`/comments/${id}`);
  dispatch({ type: DELETE_COMMENT, payload: id });
};

export const initPayment = () => {
  return {
    type: INIT_PAYMENT,
  };
};

export const deactivatePayment = () => {
  return {
    type: DEACTIVATE_PAYMENT,
  };
};

export const submitPayment = (token, amount, email) => async (dispatch) => {
  // const response = await culqi.post("/charges", {
  //   amount: amount,
  //   currency_code: "PEN",
  //   email: email,
  //   source_id: token,
  // });
  await new Promise((r) => setTimeout(r, 3000));
  const response = {
    duplicated: false,
    object: "charge",
    id: "chr_test_ZXM2hjnj8jRDkqZv",
    creation_date: 1587299031000,
    amount: 3500,
    amount_refunded: 0,
    current_amount: 3500,
    installments: 1,
    installments_amount: 3500,
    currency_code: "PEN",
    email: "gianpietro1@gmail.com",
    description: null,
    source: {
      object: "token",
      id: "tkn_test_k1FcdrEpMW2zFZg8",
      type: "card",
      creation_date: 1587298996000,
      email: "gianpietro1@gmail.com",
      card_number: "411111******1111",
      last_four: "1111",
      active: true,
      iin: {
        object: "iin",
        bin: "411111",
        card_brand: "Visa",
        card_type: "credito",
        card_category: "Clásica",
        issuer: {
          name: "BBVA",
          country: "PERU",
          country_code: "PE",
          website: null,
          phone_number: null,
        },
        installments_allowed: [2, 4, 6, 8, 10, 12, 3, 5, 7, 9, 24, 48],
      },
      client: {
        ip: "179.6.216.126",
        ip_country: "Peru",
        ip_country_code: "PE",
        browser: "UNKNOWN",
        device_fingerprint: null,
        device_type: "Escritorio",
      },
      metadata: {},
    },
    outcome: {
      type: "venta_exitosa",
      code: "AUT0000",
      merchant_message: "La operación de venta ha sido autorizada exitosamente",
      user_message: "Su compra ha sido exitosa.",
    },
    fraud_score: null,
    dispute: false,
    capture: true,
    reference_code: "gXFAxbGBMq",
    authorization_code: "LvaYeZ",
    metadata: {},
    total_fee: 173,
    fee_details: {
      fixed_fee: {},
      variable_fee: {
        currency_code: "PEN",
        commision: 0.042,
        total: 147,
      },
    },
    total_fee_taxes: 26,
    transfer_amount: 3327,
    paid: false,
    statement_descriptor: "CULQI*",
    transfer_id: null,
    capture_date: 1587299031000,
  };
  dispatch({ type: SUBMIT_PAYMENT, payload: response });
};

export const processPayment = (amount, email) => {
  return {
    type: PROCESS_PAYMENT,
    payload: { amount, email, status: "payment_processing" },
  };
};

export const createMedia = (userId) => {
  return {
    type: CREATE_MEDIA,
  };
};

export const setStream = (streamId) => {
  return {
    type: SET_STREAM,
    payload: streamId,
  };
};

export const resetStream = () => {
  return {
    type: RESET_STREAM,
  };
};

export const toggleMuteAudio = () => {
  return {
    type: TOGGLE_MUTE_AUDIO,
  };
};

export const toggleMuteVideo = () => {
  return {
    type: TOGGLE_MUTE_VIDEO,
  };
};
