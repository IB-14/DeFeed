import React, { Component } from 'react';
import "./Donation.css"
import Identicon from 'identicon.js';

class Donation extends Component {
    constructor(props){
        super(props)
        this.state={
            tip:0.000
          }
    }
    render() {
        return (
            <div className="DonationBox">
                {this.props.images.map((image)=>{
                    return(
                        <div className="donateCard">
                        <div><img src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}/></div>
                        <div><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{width:"100%"}}/></div>
                        <p>{image.description}</p>
                        <p> TIPS: {window.web3.utils.fromWei(image.donation.toString(), 'Ether')} ETH</p>
                        <input type="number" placeholder="enter tip" step="0.001" onChange={(event)=>{this.setState({tip:event.target.value})}}></input>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei(`${this.state.tip}`, 'Ether')
                            this.props.tipImageOwner(event.target.name, tipAmount)
                          }}
                        >
                          TIP 
                        </button>
                    </div>
                    );
                })}
            </div>
        );
    }
}

export default Donation;