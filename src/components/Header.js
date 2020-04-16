import React from "react";
import { Menu, Header, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";

class PageHeader extends React.Component {
  state = {};
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;

    return (
      <>
        <Header as="h2" style={{ marginTop: "1em" }}>
          <Icon name="video play" />
          <Header.Content>
            Perú En Vivo
            <Header.Subheader>
              Plataforma para artistas en vivo
            </Header.Subheader>
          </Header.Content>
        </Header>

        <Menu inverted>
          <Menu.Item
            name="streams"
            active={activeItem === "streams"}
            onClick={this.handleItemClick}
            as={Link}
            to="/"
          >
            Conciertos
          </Menu.Item>

          <Menu.Item
            name="about"
            active={activeItem === "about"}
            onClick={this.handleItemClick}
            as={Link}
            to="/about"
          >
            Sobre Nosotros
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item name="signup" position="right">
              <GoogleAuth />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </>
    );
  }
}

export default PageHeader;
