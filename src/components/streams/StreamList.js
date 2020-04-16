import React from "react";
import { Button, Item, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchStreams } from "../../actions";

class StreamList extends React.Component {
  componentDidMount() {
    this.props.fetchStreams();
  }

  renderAdmin(stream) {
    if (stream.userId === this.props.currentUserId) {
      return (
        <div>
          <div className="right floated content">
            <Link to={`/streams/edit/${stream.id}`} style={{ color: "white" }}>
              <Button color="blue" size="mini">
                Editar
              </Button>
            </Link>
            <Link to={`/streams/delete/${stream.id}`} style={{ color: "red" }}>
              <Button color="red" size="mini">
                Borrar
              </Button>
            </Link>
          </div>
        </div>
      );
    }
  }

  renderCreate() {
    if (this.props.isSignedIn) {
      return (
        <div style={{ textAlign: "right", margin: "1em" }}>
          <Link to={`/streams/new`} style={{ color: "white" }}>
            <Button color="green" size="small">
              Crear Evento
            </Button>
          </Link>
        </div>
      );
    }
  }

  renderList() {
    return this.props.streams.map(stream => {
      return (
        <Item key={stream.id}>
          <Item.Image size="small" src={`/images/${stream.image}`} />
          <Item.Content>
            <Item.Header>
              <Link to={`/streams/${stream.id}`} style={{ color: "black" }}>
                {stream.title}
              </Link>
            </Item.Header>
            <Item.Meta>{stream.date}</Item.Meta>
            <Item.Description>{stream.description}</Item.Description>
            <Item.Extra>
              Tipo de evento: {stream.type}
              {this.renderAdmin(stream)}
            </Item.Extra>
          </Item.Content>
        </Item>
      );
    });
  }

  render() {
    return (
      <>
        <div>
          <Header
            as="h2"
            content="Próximas presentaciones"
            subheader={""}
            style={{ float: "left" }}
          />
          <div style={{ float: "right", margin: "0" }}>
            {this.renderCreate()}
          </div>
        </div>

        <Item.Group divided={true}>{this.renderList()}</Item.Group>
      </>
    );
  }
}

const mapStateToProps = state => {
  // better to turn it back to array for <li>'s
  return {
    streams: Object.values(state.streams),
    currentUserId: state.auth.userId,
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(mapStateToProps, { fetchStreams })(StreamList);
