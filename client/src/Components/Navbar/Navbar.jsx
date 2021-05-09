import React, { Component } from 'react';
import Identicon from 'identicon.js';
import "./Navbar.css"

class Navbar extends Component {
    render() {
        console.log(this.props.accBalance)
        return (
            <nav className="navnav">
                <div id="account">
                    <div className="addrBal">
                        {this.props.account}
                        <span id="accountBalance"><span style={{color: "#472F99", fontWeight: "700"}}>BALANCE:</span> &ensp;{this.props.accBalance}</span>
                    </div>
                    <img src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`} />
                </div>
            </nav>
        );
    }
}

export default Navbar;