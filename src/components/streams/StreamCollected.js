import React from "react";
import { Label, Icon, Segment } from "semantic-ui-react";
import { connect } from "react-redux";

import { fetchCollected } from "../../actions";

class StreamCollected extends React.Component {
  componentDidMount() {
    this.props.fetchCollected(this.props.streamId);
    this.timer = setInterval(
      () => this.props.fetchCollected(this.props.streamId),
      10000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }
  render() {
    return (
      <Segment className="amountBox">
        <h4>Recolectado hasta el momento:</h4>
        <Label>
          <Icon color="green" name="money" />
          S/.{this.props.localStreamCollected}
        </Label>
      </Segment>
    );
  }
}

const mapStateToProps = ({ collected }) => {
  var localStreamCollected = 0;
  if (collected) {
    localStreamCollected = collected;
  }
  return {
    localStreamCollected,
  };
};

export default connect(mapStateToProps, {
  fetchCollected,
})(StreamCollected);
