import React from "react";
import AgoraRTC from "agora-rtc-sdk";
import { Embed } from "semantic-ui-react";
import { APP_ID } from "../../settings";

import defaultVideoImage from "../../assets/images/defaultVideoImage.jpg";
import "../../assets/styles/StreamBroadcaster.css";

class StreamBroadcaster extends React.Component {
  state = {
    currentStreamId: null
  };

  publishStream = () => {
    // rtc object
    const rtc = {
      client: null,
      joined: false,
      published: false,
      localStream: null,
      remoteStreams: [],
      params: {}
    };

    const option = {
      appID: APP_ID,
      channel: this.props.id.toString(),
      uid: null,
      token: this.props.token
    };

    rtc.client = AgoraRTC.createClient({
      mode: "live",
      codec: "h264"
    });

    rtc.client.setClientRole("host");
    // Initialize the client
    rtc.client.init(
      option.appID,

      () => {
        // Join a channel
        rtc.client.join(
          option.token ? option.token : null,
          option.channel,
          option.uid ? +option.uid : null,
          function(uid) {
            console.log(
              "join channel: " + option.channel + " success, uid: " + uid
            );
            rtc.params.uid = uid;
            // Create a local stream
            rtc.localStream = AgoraRTC.createStream({
              streamID: rtc.params.uid,
              audio: true,
              video: true,
              screen: false
            });

            this.setState({ currentStreamId: rtc.params.uid });

            // Initialize the local stream
            rtc.localStream.init(
              function() {
                console.log("init local stream success");
                // play stream with html element id "local_stream"
                rtc.localStream.play("local_stream");
                // Publish the local stream
                rtc.client.publish(rtc.localStream, function(err) {
                  console.log("[ERROR] : publish local stream error: " + err);
                });
              },
              function(err) {
                console.error("init local stream failed ", err);
              }
            );
          }.bind(this),
          function(err) {
            console.error("client join failed", err);
          }
        );
      },
      err => {
        console.error(err);
      }
    );
  };

  render() {
    const adminButtons = () => {
      return (
        <div className="playerMenu">
          <button className="ui icon button">
            <i className="video icon"></i>
          </button>
          <button className="ui icon button">
            <i className="microphone icon"></i>
          </button>
          <button className="ui icon button">
            <i className="desktop icon"></i>
          </button>
          <button className="ui icon button">
            <i className="close icon"></i>
          </button>
        </div>
      );
    };
    const streamId = this.state.currentStreamId;

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

export default StreamBroadcaster;
