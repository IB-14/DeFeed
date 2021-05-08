import React, { Component } from 'react';

class UnAuthorized extends Component {
    render() {
        return (
            <div className="unAuthWrap">
                <div className="unlogo">
                    <img className="log" src={process.env.PUBLIC_URL + '/Images/DeFeed_Logo.svg'} />
                </div>
                <div className="unAuthorized">
                        <img className="ethTower" src={process.env.PUBLIC_URL + '/Images/ethTower.svg'} alt="" />
                        Connect using your Metamask wallet
                </div>
            </div>
        );
    }
}

export default UnAuthorized;