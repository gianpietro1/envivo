import React from "react";
import { Embed } from "semantic-ui-react";
import { connect } from "react-redux";

import history from "../../history";
import RTCClient from "../../rtcClient";
import { createMedia, setStream, resetStream } from "../../actions";
import defaultVideoImage from "../../assets/images/defaultVideoImage.jpg";
import "../../assets/styles/StreamAudience.css";

class StreamAudience extends React.Component {
  constructor() {
    super();
    this.streamClient = this.localClient();
  }

  componentDidMount() {
    this.props.createMedia();
    this.subscribeToStream();
  }

  componentWillUnmount() {
    this.props.resetStream();
    if (this.streamClient) {
      this.streamClient.leave();
      if (this.streamClient._localStream) {
        this.streamClient._localStream.close();
        this.streamClient.destroy();
      }
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
    this.props.resetStream();
    if (this.streamClient) {
      this.streamClient.leave();
      if (this.streamClient._localStream) {
        this.streamClient._localStream.close();
        this.streamClient.destroy();
      }
    }
    history.push("/");
  }

  subscribeToStream = () => {
    const option = {
      appID: process.env.REACT_APP_AGORA_APP_ID,
      channel: this.props.id,
      uid: null,
      token: this.props.token,
      host: false,
    };
    console.log(`This one is: ${this}`);
    //this.props.setClient(streamClient);
    this.streamClient.join(option).then((uid) => {
      // set action stream is ON
      this.props.setStream(this.streamClient._params.uid);
      console.log(`This two is: ${this}`);

      // Manage subscriptions
      this.streamClient.on("stream-added", (evt) => {
        console.log(`This three is: ${this}`);

        var remoteStream = evt.stream;
        var id = remoteStream.getId();
        if (id !== this.streamClient._params.uid) {
          this.streamClient.subscribe(remoteStream, function(err) {
            console.log("stream subscribe failed", err);
          });
        }
        console.log("stream-added remote-uid: ", id);
      });

      this.streamClient.on("stream-subscribed", (evt) => {
        var remoteStream = evt.stream;
        // Add a view for the remote stream.
        this.props.setStream(this.streamClient._params.uid);
        // Play the remote stream.
        remoteStream.play("remote_video_" + this.streamClient._params.uid);
      });

      this.streamClient.on("stream-removed", (evt) => {
        var remoteStream = evt.stream;
        var id = this.streamClient._params.uid;
        // Stop playing the remote stream.
        remoteStream.stop("remote_video_" + id);
        // Remove the view of the remote stream.
        this.props.resetStream();
        console.log("stream-removed remote-uid: ", id);
      });
    });
  };

  render() {
    const streamId = this.props.media.streamId;

    if (!streamId) {
      return (
        <Embed
          icon="right circle arrow"
          // onClick={() => this.subscribeToStream()}
          placeholder={defaultVideoImage}
        />
      );
    }
    return (
      <div className="ui video" id="video">
        <div id={`remote_video_panel_${streamId}`} className="video-view">
          <div
            id={`remote_video_${streamId}`}
            className="video-placeholder"
          ></div>
          <div
            id={`remote_video_info_${streamId}`}
            className="video-profile hide"
          ></div>
          <div
            id={`video_autoplay_${streamId}`}
            className="autoplay-fallback hide"
          ></div>
        </div>
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
})(StreamAudience);
