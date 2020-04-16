import React from "react";
import { Field, reduxForm } from "redux-form";
import { Button, Form, Segment } from "semantic-ui-react";

import "../../assets/styles/StreamPayForm.css";

class StreamPayForm extends React.Component {
  cancelPayment = () => {
    this.props.cancelPayment();
  };

  processPay = formValues => {
    // Culqi.createToken();
    console.log(formValues);
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

  normalizeMonth = value => {
    if (!value) {
      return value;
    }

    const onlyNums = value.replace(/[^\d]/g, "");
    if (onlyNums.length <= 2) {
      return onlyNums;
    }
    return `${onlyNums.slice(0, 2)}`;
  };

  normalizeCard = value => {
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

  normalizeCVV = value => {
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
        <Form inverted onSubmit={this.props.handleSubmit(this.processPay)}>
          <Field
            component={this.renderInput}
            placeholder="Correo Electrónico"
            name="email"
            data-culqi="card[email]"
            id="card[email]"
          />
          <Field
            component={this.renderInput}
            placeholder="Número de tarjeta"
            name="cardnumber"
            data-culqi="card[number]"
            id="card[number]"
            normalize={this.normalizeCard}
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
              dataCulqi="card[exp_month]"
              id="card[exp_month]"
              normalize={this.normalizeMonth}
            />
            <Field
              component={this.renderInput}
              placeholder="Año Exp"
              name="exp_year"
              dataCulqi="card[exp_year]"
              id="card[exp_year]"
              normalize={this.normalizeMonth}
            />
          </Form.Group>

          <Button.Group style={{ width: "100%" }}>
            <Button negative onClick={() => this.cancelPayment()}>
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

export default reduxForm({
  form: "streamPayForm"
  // validate
})(StreamPayForm);
