import React from "react";
import { Embed, Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import history from "../../history";
import RTCClient from "../../rtcClient";
import {
  createMedia,
  setStream,
  resetStream,
  toggleMuteAudio,
  toggleMuteVideo,
} from "../../actions";

import defaultVideoImage from "../../assets/images/defaultVideoImage.jpg";
import "../../assets/styles/StreamBroadcaster.css";

class StreamBroadcaster extends React.Component {
  constructor() {
    super();
    this.streamClient = this.localClient();
  }

  componentDidMount() {
    this.props.createMedia();
  }

  componentWillUnmount() {
    this.closeStream();
  }

  localClient = () => {
    const client = new RTCClient();
    if (!client._created) {
      client.createClient({
        codec: "h264",
        mode: "live",
      });
      client._created = true;
    }
    return client;
  };

  closeStream() {
    this.props.resetStream();
    this.streamClient._localStream.close();
    this.streamClient.destroy();
    history.push("/");
  }

  publishStream() {
    const option = {
      appID: process.env.REACT_APP_AGORA_APP_ID,
      channel: this.props.id.toString(),
      uid: null,
      token: this.props.token,
      host: true,
    };
    console.log(option.token);
    //this.props.setClient(streamClient);
    this.streamClient.join(option).then((uid) => {
      // set action stream is ON
      this.props.setStream(this.streamClient._params.uid);
      this.streamClient._localStream.play("local_stream");
      this.streamClient.publish();
    });
  }

  handleMuteAudio() {
    this.props.toggleMuteAudio();
  }

  handleMuteVideo() {
    this.props.toggleMuteVideo();
  }

  render() {
    const adminButtons = () => {
      return (
        <div className="playerMenu">
          <Button
            icon
            toggle
            active={!this.props.media.muteVideo}
            onClick={() => this.handleMuteVideo()}
          >
            <Icon name="video" />
          </Button>
          <Button
            icon
            toggle
            active={!this.props.media.muteAudio}
            onClick={() => this.handleMuteAudio()}
          >
            <Icon name="microphone" />
          </Button>
          {/* <button className="ui icon button">
            <i className="desktop icon"></i>
          </button> */}
          <button className="ui icon button" onClick={() => this.closeStream()}>
            <i className="close icon"></i>
          </button>
        </div>
      );
    };
    const streamId = this.props.media.streamId;

    if (!streamId) {
      return (
        <Embed
          icon="video"
          onClick={() => this.publishStream()}
          placeholder={defaultVideoImage}
        />
      );
    }
    return (
      <div
        className="ui embed"
        id="local_stream"
        icon="video"
        placeholder={defaultVideoImage}
      >
        {adminButtons()}
      </div>
    );
  }
}

const mapStateToProps = ({ media }) => {
  return {
    media,
  };
};

export default connect(mapStateToProps, {
  createMedia,
  setStream,
  resetStream,
  toggleMuteAudio,
  toggleMuteVideo,
})(StreamBroadcaster);
