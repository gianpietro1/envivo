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
  updateStream,
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
    this.props.updateStream(this.props.id, { streaming: false });
    if (this.props.media.streamId) {
      this.props.resetStream();
      this.streamClient._localStream.close();
      this.streamClient.destroy();
    }
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
    this.props.updateStream(this.props.id, { streaming: false });
    if (this.props.media.streamId) {
      this.props.resetStream();
      this.streamClient._localStream.close();
      this.streamClient.destroy();
      history.push("/");
    }
  }

  publishStream() {
    const option = {
      appID: process.env.REACT_APP_AGORA_APP_ID,
      channel: this.props.id,
      uid: null,
      token: this.props.token,
      host: true,
      resolution: { audio: "high_quality_stereo", video: "720p_1" },
    };
    console.log(`MY APP IS ${option.appID}`);

    console.log(`MY TOKEN IS ${option.token}`);
    //this.props.setClient(streamClient);
    this.streamClient.join(option).then((uid) => {
      // set action stream is ON
      console.log(this.streamClient);
      console.log(this.streamClient._localStream);
      this.props.setStream(this.streamClient._params.uid);

      this.props.updateStream(option.channel, { streaming: true });
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
          <Button icon onClick={() => this.closeStream()}>
            <Icon name="close" />
          </Button>
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
  updateStream,
})(StreamBroadcaster);
