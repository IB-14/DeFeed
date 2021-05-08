import React, { Component } from 'react';
import Navbar from "../Navbar/Navbar"
import Sidebar from "../Sidebar/Sidebar"
import "./Dashboard.css"

class Dashboard extends Component {
    render() {
        return (
            <div className="Dashboard">
                <div className="barNav">
                    <Navbar account={this.props.account}/>
                </div>
                <div className="dashWrap">
                    <div className="sideBar">
                        <Sidebar />
                    </div>
                    <div></div>
                </div>
            </div>
        );
    }
}

export default Dashboard;