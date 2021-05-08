import React, { Component } from 'react';
import Navbar from "../Navbar/Navbar"
import Sidebar from "../Sidebar/Sidebar"
import Donation from "./Donation/Donation"
import Supply from "./Supply/Supply"
import AddPost from "./Add Post/AddPost"
import "./Dashboard.css"

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state= {
            Board: "donate"
        }
        //this.clickActive = this.clickActive.bind(this);
    }

    // clickActive(s) {
    //     this.setState({Board: s})
    // }

    clickActive=(s)=>{
        this.setState({Board: s})
    }

    render() {

        let activeBoard;
        if(this.state.Board === "donate") {
            activeBoard= <Donation />
        }
        if(this.state.Board === "supply") {
            activeBoard= <Supply />
        }
        if(this.state.Board === "add post") {
            activeBoard= <AddPost />
        }

        return (
            <div className="Dashboard">
                <div className="barNav">
                    <Navbar account={this.props.account}/>
                </div>
                <div className="dashWrap">
                    <div className="sideBar">
                        <Sidebar Board={this.state.Board} clickActive={this.clickActive} />
                    </div>
                    <img className="vert" src={process.env.PUBLIC_URL + './Images/Verticle.svg'} />
                    <div className="Board">
                        {activeBoard}
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;