import React from "react";
import { connect } from "react-redux";
import { Comment, Segment } from "semantic-ui-react";
import { createComment, fetchComments, deleteComment } from "../../actions";
import StreamCommentsForm from "./StreamCommentsForm";

class StreamComments extends React.Component {
  componentDidMount() {
    const streamId = this.props.streamId;
    this.props.fetchComments(streamId);
    this.timer = setInterval(() => this.props.fetchComments(streamId), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  messagesEndRef = React.createRef();

  onSubmitComment = (formValues) => {
    const streamId = this.props.streamId;
    this.props.createComment(streamId, formValues.comment);
    this.scrollToBottom();
  };

  onDeleteComment = (commentId) => {
    this.props.deleteComment(commentId);
  };

  componentDidUpdate() {
    // this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  renderCommentList() {
    return this.props.comments.map((comment) => {
      return (
        <Comment key={comment.id}>
          <Comment.Avatar src="/avatars/elliot.jpg" />
          <Comment.Content>
            <Comment.Author>{comment.userId}</Comment.Author>
            <Comment.Metadata style={{ marginLeft: "0" }}>
              {comment.date}
            </Comment.Metadata>
            <Comment.Text>{comment.comment}</Comment.Text>
            {this.props.currentUserId === comment.userId
              ? this.renderCommentDelete(comment)
              : ""}
          </Comment.Content>
        </Comment>
      );
    });
  }

  renderCommentDelete(comment) {
    return (
      <Comment.Actions>
        <Comment.Action onClick={() => this.onDeleteComment(comment.id)}>
          Borrar
        </Comment.Action>
      </Comment.Actions>
    );
  }

  render() {
    return (
      <Comment.Group>
        <Segment style={{ overflow: "auto", maxHeight: 305 }}>
          {this.renderCommentList()}
          <div ref={this.messagesEndRef} />
        </Segment>
        {this.props.currentUserId ? (
          <StreamCommentsForm onSubmit={this.onSubmitComment} />
        ) : (
          <p>Ingrese para comentar</p>
        )}
      </Comment.Group>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    comments: Object.values(state.comments),
    currentUserId: state.auth.userId,
  };
};

export default connect(mapStateToProps, {
  fetchComments,
  createComment,
  deleteComment,
})(StreamComments);
