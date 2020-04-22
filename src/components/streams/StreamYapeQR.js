import React from "react";
import { Button, Image, Segment } from "semantic-ui-react";
import { connect } from "react-redux";
import { initPayment, deactivatePayment } from "../../actions";

class StreamYapeQR extends React.Component {
  componentDidMount() {
    this.props.initPayment("yape");
  }

  componentWillUnmount() {
    this.props.deactivatePayment();
  }

  paymentOver = () => {
    this.props.deactivatePayment();
  };

  render() {
    return (
      <Segment inverted>
        <h3 style={{ textAlign: "center" }}>
          ¡Gracias! Continúa en el App de Yape
        </h3>
        <Image
          src={"/images/yapeqr1.png"}
          style={{ width: "60%", margin: "auto" }}
        ></Image>
        <p></p>
        <Button.Group style={{ width: "100%" }}>
          <Button positive onClick={() => this.paymentOver()}>
            Volver
          </Button>
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    paymentStatus: state.payment.status,
  };
};

export default connect(mapStateToProps, {
  initPayment,
  deactivatePayment,
})(StreamYapeQR);
