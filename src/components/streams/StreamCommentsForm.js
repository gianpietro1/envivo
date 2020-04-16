import React from "react";
import { reset, Field, reduxForm } from "redux-form";
import { Form, TextArea } from "semantic-ui-react";

class StreamCommentsForm extends React.Component {
  // renderError({ error, touched }) {
  //   if (touched && error) {
  //     return (
  //       <div className="ui error message">
  //         <div className="header">{error}</div>
  //       </div>
  //     );
  //   }
  // }

  renderInput = ({ input, meta, placeholder }) => {
    return (
      <div>
        <TextArea
          {...input}
          autoComplete="off"
          placeholder={placeholder}
          style={{ height: "4em", minHeight: "4em" }}
        />
      </div>
    );
  };

  onSubmit = (formValues) => {
    this.props.onSubmit(formValues);
  };

  handleKeyDown = function(e, cb) {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      cb();
    }
  };

  render() {
    return (
      <Form
        reply
        onKeyDown={(e) => {
          this.handleKeyDown(e, this.props.handleSubmit(this.onSubmit));
        }}
      >
        <Field
          name="comment"
          component={this.renderInput}
          placeholder="Comentar (Enter para enviar)"
        />
      </Form>
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

const afterSubmit = (result, dispatch) => dispatch(reset("streamCommentsForm"));

export default reduxForm({
  form: "streamCommentsForm",
  onSubmitSuccess: afterSubmit,
  // validate
})(StreamCommentsForm);
