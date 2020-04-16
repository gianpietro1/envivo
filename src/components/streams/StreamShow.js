import React from "react";
import { connect } from "react-redux";
import { Header, Grid, Button } from "semantic-ui-react";
import {
  fetchStream,
  getStreamToken,
  createComment,
  fetchComments,
  activatePayment,
  deactivatePayment
} from "../../actions";
import StreamBroadcaster from "./StreamBroadcaster";
import StreamAudience from "./StreamAudience";
import StreamComments from "./StreamComments";
import StreamPayForm from "./StreamPayForm";

class StreamShow extends React.Component {
  componentDidMount() {
    const streamId = this.props.match.params.id;
    this.props.fetchStream(streamId);
    this.props.fetchComments(streamId);
  }

  componentDidUpdate() {}

  renderPlayer() {
    const { id, userId } = this.props.stream;
    const isAdmin = this.props.currentUserId === userId ? true : false;
    const streamId = this.props.match.params.id;
    this.props.getStreamToken(streamId);

    if (this.props.token) {
      if (isAdmin) {
        return (
          <>
            <StreamBroadcaster
              id={id}
              isAdmin={isAdmin}
              token={this.props.token}
            />
          </>
        );
      } else {
        return (
          <>
            <StreamAudience id={id} token={this.props.token} />
          </>
        );
      }
    }
  }

  onSubmitComment = formValues => {
    const streamId = this.props.match.params.id;
    this.props.createComment(streamId, formValues.comment);
  };

  renderPayForm = () => {
    this.props.activatePayment();
  };

  cancelPayment = () => {
    this.props.deactivatePayment();
  };

  renderCommentsOrPayment = () => {
    if (this.props.paymentStatus === true) {
      return (
        <StreamPayForm
          cancelPayment={this.cancelPayment}
          expirationDate={this.props.expirationDate}
        />
      );
    }
    return <StreamComments streamId={this.props.stream.id} />;
  };

  render() {
    if (!this.props.stream) {
      return <div>Loading...</div>;
    }
    const { userId } = this.props.stream;
    const isAdmin = this.props.currentUserId === userId ? true : false;
    const { title, description } = this.props.stream;
    return (
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={11}>
            {isAdmin !== null ? this.renderPlayer() : "Loading Player"}
          </Grid.Column>
          <Grid.Column width={5}>
            <Button
              color="green"
              style={{ width: "100%" }}
              onClick={this.renderPayForm}
            >
              Enviar aporte
            </Button>
            {this.renderCommentsOrPayment()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h2" content={title} subheader={description} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const streamId = ownProps.match.params.id;
  const expirationDate = state.form.streamPayForm
    ? state.form.streamPayForm.values
      ? state.form.streamPayForm.values.exp_month
      : ""
    : "";
  return {
    stream: state.streams[streamId],
    currentUserId: state.auth.userId,
    token: state.token,
    paymentStatus: state.paymentStatus,
    expirationDate: expirationDate
  };
};

export default connect(mapStateToProps, {
  fetchStream,
  fetchComments,
  getStreamToken,
  createComment,
  activatePayment,
  deactivatePayment
})(StreamShow);
