import React, { Component } from 'react';

class Sidebar extends Component {
    render() {
        return (
            <nav>
                <div>
                    <img className="log" src={process.env.PUBLIC_URL + '/Images/DeFeed_Logo.svg'} />
                </div>
            </nav>
        );
    }
}

export default Sidebar;