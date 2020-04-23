import React from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { signIn, signOut } from "../actions";

class GoogleAuth extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      window.gapi.load("client:auth2", () => {
        window.gapi.client
          .init({
            clientId: process.env.REACT_APP_GOOGLE_KEY,
            scope: "email",
          })
          .then(() => {
            this.auth = window.gapi.auth2.getAuthInstance();

            this.onAuthChange(this.auth.isSignedIn.get());
            this.auth.isSignedIn.listen(this.onAuthChange);
          });
      });
    }, 1000);
  }

  onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      const email = this.auth.currentUser
        .get()
        .getBasicProfile()
        .getEmail();
      this.props.signIn(this.auth.currentUser.get().getId(), email);
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return null;
    } else if (this.props.isSignedIn) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button">
          <i className="google icon" />
          Salir
        </button>
      );
    } else {
      return (
        <>
          <span style={{ margin: "0 1em 0 0" }}>Ingresar:</span>

          <Button
            circular
            color="red"
            icon="google"
            onClick={this.onSignInClick}
          />
          <Button
            circular
            color="facebook"
            icon="facebook"
            onClick={this.onSignOutClick}
          />
        </>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
