import React, { Component } from 'react';
import "./Sidebar.css"

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state= {
            activeLink: this.props.Board
        }
    }

    // this.props.clickActive("supply").bind(this)
    // this.props.clickActive("add post").bind(this)

    changeActLink(s) {
        this.setState({activeLink: s})
        console.log(this.state.activeLink);
        this.props.clickActive(s);
    }


    render() {

        let actLinkS1, actLinkS2, actLinkS3
        if(this.state.activeLink === "donate") {
            actLinkS1= "actLinkS";
        }
        if(this.state.activeLink === "supply") {
            actLinkS2= "actLinkS";
        }
        if(this.state.activeLink === "add post") {
            actLinkS3= "actLinkS";
        }

        return (
            <nav>
                <div>
                    <img className="log" src={process.env.PUBLIC_URL + '/Images/DeFeed_Logo.svg'} />
                    <div className="barLinks">                        
                        <div id="sideLink" className={actLinkS1} onClick={()=>{this.changeActLink("donate")}}>DONATE</div>
                        <div id="sideLink" className={actLinkS2} onClick={()=>{this.changeActLink("supply")}}>SUPPLY</div>
                        <div id="sideLink" className={actLinkS3} onClick={()=>{this.changeActLink("add post")}}>ADD POST</div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Sidebar;