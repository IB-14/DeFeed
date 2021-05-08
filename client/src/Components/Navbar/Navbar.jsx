import React, { Component } from 'react';
import Identicon from 'identicon.js';
import "./Navbar.css"

class Navbar extends Component {
    render() {
        return (
            <nav className="navnav">
                <div id="account">
                    {this.props.account}
                    <img src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`} />
                </div>
            </nav>
        );
    }
}

export default Navbar;