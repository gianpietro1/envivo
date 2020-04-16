import React from "react";
import { Field, reduxForm } from "redux-form";

class StreamForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      );
    }
  }

  renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      // className of "error" is needed for Semantic not to hide errors
      <form
        onSubmit={this.props.handleSubmit(this.onSubmit)}
        className="ui form error"
      >
        <Field name="title" component={this.renderInput} label="Title" />
        <Field
          name="description"
          component={this.renderInput}
          label="Description"
        />
        <button className="ui button primary">Submit</button>
      </form>
    );
  }
}

const validate = formValues => {
  // if we return an empty object, that means validation was OK
  const errors = {};
  if (!formValues.title) {
    // only run if user did not enter title
    errors.title = "You must enter a title.";
  }
  if (!formValues.description) {
    // the property name needs to be the same as the field name
    errors.description = "You must enter a description.";
  }

  return errors;
};

export default reduxForm({
  form: "streamForm",
  validate
})(StreamForm);
