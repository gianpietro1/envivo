import React from "react";
import { Field, reduxForm } from "redux-form";
import { Button, Form, Segment } from "semantic-ui-react";
import { connect } from "react-redux";

import {
  initPayment,
  processPayment,
  submitPayment,
  deactivatePayment,
  createCollected,
} from "../../actions";
import "../../assets/styles/StreamPayForm.css";

class StreamPayForm extends React.Component {
  constructor() {
    super();
    window.StreamPayComponent = this;
  }

  componentWillUnmount() {
    this.props.deactivatePayment();
  }

  componentDidMount() {
    this.props.initPayment("card");
  }

  processPayment = ({ email }) => {
    const amount = this.props.paymentAmount;
    this.props.processPayment(amount, email);
    console.log(`about to submit payment with ${amount} and ${email}`);
    const Culqi = window.Culqi;
    Culqi.createToken();
  };

  culqiback(token) {
    const { amount, email } = this.props.payment;
    console.log(`submiting payment with ${token}, ${amount} and ${email}`);
    this.props.submitPayment(token, amount, email);
    this.props.createCollected(this.props.streamId, parseInt(amount));
  }

  paymentOver = () => {
    this.props.deactivatePayment();
  };

  renderInput = ({ input, placeholder, dataCulqi, id }) => {
    return (
      <Form.Field>
        <Form.Input
          fluid
          {...input}
          id={id}
          data-culqi={dataCulqi}
          placeholder={placeholder}
          autoComplete="off"
        />
      </Form.Field>
    );
  };

  renderInputCard = ({ input, placeholder, dataCulqi, id }) => {
    return (
      <Form.Field>
        <Form.Input
          fluid
          {...input}
          id={id}
          data-culqi={dataCulqi}
          placeholder={placeholder}
          autoComplete="off"
          type="number"
        />
      </Form.Field>
    );
  };

  normalizeMonth = (value) => {
    if (!value) {
      return value;
    }

    const onlyNums = value.replace(/[^\d]/g, "");
    if (onlyNums.length <= 2) {
      return onlyNums;
    }
    return `${onlyNums.slice(0, 2)}`;
  };

  normalizeYear = (value) => {
    if (!value) {
      return value;
    }

    const onlyNums = value.replace(/[^\d]/g, "");
    if (onlyNums.length <= 4) {
      return onlyNums;
    }
    return `${onlyNums.slice(0, 4)}`;
  };

  normalizeCard = (value) => {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, "");
    if (onlyNums.length <= 4) {
      return onlyNums;
    }
    if (onlyNums.length <= 8) {
      return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4)}`;
    }
    if (onlyNums.length <= 12) {
      return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4, 8)}-${onlyNums.slice(
        8
      )}`;
    }
    return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4, 8)}-${onlyNums.slice(
      8,
      12
    )}-${onlyNums.slice(12, 16)}`;
  };

  normalizeCVV = (value) => {
    if (!value) {
      return value;
    }

    const onlyNums = value.replace(/[^\d]/g, "");
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    return `${onlyNums.slice(0, 3)}`;
  };

  render() {
    return (
      <Segment inverted>
        <Form inverted onSubmit={this.props.handleSubmit(this.processPayment)}>
          <div>
            <h3 style={{ textAlign: "center" }}>
              ¡Gracias! Estás por aportarnos:
            </h3>
            <h1
              style={{
                fontSize: "2em",
                fontWeight: "bold",
                textAlign: "center",
                color: "lightblue",
                marginTop: "0",
                marginBottom: "0.5em",
              }}
            >
              S/.{this.props.paymentAmount}.00
            </h1>
          </div>
          <Field
            component={this.renderInput}
            placeholder="Correo Electrónico"
            name="email"
            data-culqi="card[email]"
            id="card[email]"
          />
          <Field
            component={this.renderInputCard}
            placeholder="Número de tarjeta"
            name="cardnumber"
            data-culqi="card[number]"
            id="card[number]"
          />
          <Form.Group widths="equal">
            <Field
              component={this.renderInput}
              placeholder="CVV"
              name="cvv"
              data-culqi="card[cvv]"
              id="card[cvv]"
              normalize={this.normalizeCVV}
            />
            <Field
              component={this.renderInput}
              placeholder="Mes Exp"
              name="exp_month"
              data-culqi="card[exp_month]"
              id="card[exp_month]"
              normalize={this.normalizeMonth}
            />
            <Field
              component={this.renderInput}
              placeholder="Año Exp"
              name="exp_year"
              data-culqi="card[exp_year]"
              id="card[exp_year]"
              normalize={this.normalizeYear}
            />
          </Form.Group>

          <Button.Group style={{ width: "100%" }}>
            <Button negative onClick={() => this.paymentOver()}>
              Cancelar
            </Button>
            <Button.Or />
            <Button id="btn_pagar" type="submit" positive>
              Pagar
            </Button>
          </Button.Group>
        </Form>
      </Segment>
    );
  }
}

// const validate = formValues => {
//   // if we return an empty object, that means validation was OK
//   const errors = {};
//   if (!formValues.title) {
//     // only run if user did not enter title
//     errors.title = "You must enter a title.";
//   }
//   if (!formValues.description) {
//     // the property name needs to be the same as the field name
//     errors.description = "You must enter a description.";
//   }

//   return errors;
// };

const mapStateToProps = ({ payment }) => {
  return {
    payment,
  };
};

export default connect(mapStateToProps, {
  initPayment,
  processPayment,
  submitPayment,
  deactivatePayment,
  createCollected,
})(
  reduxForm({
    form: "streamPayForm",
    // validate
  })(StreamPayForm)
);
