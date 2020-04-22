import React from "react";
import { connect } from "react-redux";
import {
  Segment,
  Header,
  Grid,
  Menu,
  Input,
  Button,
  Image,
  Label,
} from "semantic-ui-react";
import {
  fetchStream,
  getStreamToken,
  createComment,
  fetchComments,
  initPayment,
  setAmount,
} from "../../actions";
import StreamBroadcaster from "./StreamBroadcaster";
import StreamAudience from "./StreamAudience";
import StreamComments from "./StreamComments";
import StreamPayForm from "./StreamPayForm";
import StreamYapeQR from "./StreamYapeQR";
import StreamCollected from "./StreamCollected";
import "../../assets/styles/StreamShow.css";
import YapeImage from "../../assets/images/yape.png";

class StreamShow extends React.Component {
  constructor() {
    super();
    this.input = React.createRef();
  }

  componentDidMount() {
    const streamId = this.props.match.params.id;
    this.props.fetchStream(streamId);
    this.props.fetchComments(streamId);
    this.props.getStreamToken(streamId);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  renderPlayer() {
    const { id, userId } = this.props.stream;
    const isAdmin = this.props.currentUserId === userId ? true : false;
    if (this.props.token) {
      if (isAdmin) {
        return (
          <>
            <StreamBroadcaster
              id={id.toString()}
              isAdmin={isAdmin}
              token={this.props.token}
            />
          </>
        );
      } else {
        return (
          <>
            <StreamAudience id={id.toString()} token={this.props.token} />
          </>
        );
      }
    }
  }

  onSubmitComment = (formValues) => {
    const streamId = this.props.match.params.id;
    this.props.createComment(streamId, formValues.comment);
  };

  renderPayForm = (inputValue) => {
    if (inputValue === "yape") {
      this.props.initPayment("yape");
    } else if (inputValue === "freeInput" && this.props.paymentAmount) {
      this.props.initPayment("card");
    } else {
      // this.props.setAmount(inputValue);
      // this.props.initPayment("card");
    }
  };

  renderCommentsOrPayment = () => {
    if (this.props.paymentStatus === "payment_init_yape") {
      return <StreamYapeQR />;
    } else if (this.props.paymentStatus === "payment_init_card") {
      return (
        <StreamPayForm
          paymentAmount={this.props.paymentAmount}
          collectedAmount={this.props.stream.collected}
          streamId={this.props.stream.id}
        />
      );
    }
    return <StreamComments streamId={this.props.stream.id} />;
  };

  renderPaymentOrCollected = () => {
    const { userId } = this.props.stream;
    const isAdmin = this.props.currentUserId === userId ? true : false;
    if (isAdmin) {
      return (
        <StreamCollected
          collectedAmount={this.props.stream.collected}
          streamId={this.props.stream.id}
        />
      );
    }
    return this.renderPaymentAmount();
  };

  renderPaymentAmount() {
    if (this.props.mediaStreamId) {
      return (
        <Segment className="amountBox">
          <h4>
            ¿Te gusta el evento? Realiza un aporte con Tarjeta de Crédito o
            Yape:
          </h4>
          <Menu secondary widths={2} id="payment_buttons">
            {/* <Menu.Item name="10">
              <Button
                value="10"
                positive
                onClick={(e) => this.renderPayForm(e.target.value)}
              >
                S/.10
              </Button>
            </Menu.Item>
            <Menu.Item name="50">
              <Button
                value="50"
                positive
                onClick={(e) => this.renderPayForm(e.target.value)}
              >
                S/.50
              </Button>
            </Menu.Item> */}
            <Menu.Item>
              <Input
                style={{ height: "36px" }}
                onChange={(e) => this.props.setAmount(e.target.value)}
                maxLength="3"
                label="con tarjeta"
              >
                <Label basic>S/.</Label>
                <input />
                <Button
                  icon="caret square right"
                  onClick={() => this.renderPayForm("freeInput")}
                />
              </Input>
            </Menu.Item>
            <Menu.Item>
              <Image
                style={{ height: "36px", cursor: "pointer" }}
                src={YapeImage}
                onClick={() => this.renderPayForm("yape")}
              />
            </Menu.Item>
          </Menu>
        </Segment>
      );
    }
  }

  render() {
    if (!this.props.stream) {
      return <div>Loading...</div>;
    }
    const { title, description } = this.props.stream;
    return (
      <Grid stackable columns={2}>
        <Grid.Row style={{ minHeight: "470px" }}>
          <Grid.Column width={11}>{this.renderPlayer()}</Grid.Column>
          <Grid.Column width={5}>
            {this.renderPaymentOrCollected()}

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
  return {
    stream: state.streams[streamId],
    currentUserId: state.auth.userId,
    paymentStatus: state.payment.status,
    paymentAmount: state.payment.amount,
    token: state.token,
    mediaStreamId: state.media.streamId,
  };
};

export default connect(mapStateToProps, {
  fetchStream,
  fetchComments,
  getStreamToken,
  createComment,
  initPayment,
  setAmount,
})(StreamShow);
