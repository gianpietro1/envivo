import React from "react";
import AgoraRTC from "agora-rtc-sdk";
import { Embed } from "semantic-ui-react";

import defaultVideoImage from "../../assets/images/defaultVideoImage.jpg";
import "../../assets/styles/StreamAudience.css";

class StreamAudience extends React.Component {
  state = {
    currentMediaId: null,
  };

  componentDidMount() {
    //this.buildPlayer();
  }

  componentDidUpdate() {
    if (this.props.isAdmin) {
    }
  }

  componentWillUnmount() {
    if (this.state.currentMediaId) {
      //this.destroyPlayer();
    }
  }

  buildPlayer = () => {
    // rtc object
    const rtc = {
      client: null,
      joined: false,
      published: false,
      localStream: null,
      remoteStreams: [],
      params: {},
    };

    const option = {
      appID: process.env.REACT_APP_AGORA_ID,
      channel: this.props.id.toString(),
      uid: null,
      token: this.props.token,
    };

    // Create a client
    rtc.client = AgoraRTC.createClient({
      mode: "live",
      codec: "h264",
    });

    // Initialize the client
    rtc.client.init(
      option.appID,
      function() {
        // The value of role can be "host" or "audience".
        rtc.client.setClientRole("audience");
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
          },
          function(err) {
            console.error("client join failed", err);
          }
        );
      },
      (err) => {
        console.error(err);
      }
    );

    // Manage subscription
    rtc.client.on("stream-added", function(evt) {
      var remoteStream = evt.stream;
      var id = remoteStream.getId();
      if (id !== rtc.params.uid) {
        rtc.client.subscribe(remoteStream, function(err) {
          console.log("stream subscribe failed", err);
        });
      }
      console.log("stream-added remote-uid: ", id);
    });

    rtc.client.on(
      "stream-subscribed",
      function(evt) {
        var remoteStream = evt.stream;
        const mediaId = remoteStream.getId();
        // Add a view for the remote stream.
        this.setState({ currentMediaId: mediaId });
        // Play the remote stream.
        remoteStream.play("remote_video_" + mediaId);
      }.bind(this)
    );

    rtc.client.on(
      "stream-removed",
      function(evt) {
        var remoteStream = evt.stream;
        var id = remoteStream.getId();
        // Stop playing the remote stream.
        remoteStream.stop("remote_video_" + id);
        // Remove the view of the remote stream.
        this.setState({ currentMediaId: null });
        console.log("stream-removed remote-uid: ", id);
      }.bind(this)
    );
  };

  render() {
    const mediaId = this.state.currentMediaId;

    if (!mediaId) {
      return (
        <Embed
          icon="right circle arrow"
          onClick={() => this.buildPlayer()}
          placeholder={defaultVideoImage}
        />
      );
    }
    return (
      <div className="ui video" id="video">
        <div id={`remote_video_panel_${mediaId}`} className="video-view">
          <div
            id={`remote_video_${mediaId}`}
            className="video-placeholder"
          ></div>
          <div
            id={`remote_video_info_${mediaId}`}
            className="video-profile hide"
          ></div>
          <div
            id={`video_autoplay_${mediaId}`}
            className="autoplay-fallback hide"
          ></div>
        </div>
      </div>
    );
  }
}

export default StreamAudience;
