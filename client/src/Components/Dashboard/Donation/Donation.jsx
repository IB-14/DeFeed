import React, { Component } from 'react';
import "./Donation.css"
import Identicon from 'identicon.js';

class Donation extends Component {
    constructor(props){
        super(props)
        this.state={
            tip:0
          }
    }

    updateDetails() {
      this.forceUpdate();
    }

    render() {
        return (
            <div className="DonationBox">
                {this.props.images.map((image)=>{
                    return(
                        <div className="donateCard">
                          <div className="identiDisplay">
                            <img id="ident" src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}/>
                          </div>
                          <img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{width:"90%", height: "180px", opacity: "1"}}/>
                          <span>{image.description}</span>
                        
                          <div className="donateDiv">
                            <input className="inpinp" type="number" placeholder="Enter Amount" step="0.001" onChange={(event)=>{this.setState({tip:event.target.value})}} />
                            <button
                              className="cutcutbut"
                              name={image.id}
                              style={{backgroundColor: "#472F99", border: "none", height: "100%", width: "100%"}}
                              onClick={(event) => {
                                console.log(this.state.tip)
                                let tipAmount = window.web3.utils.toWei(this.state.tip.toString(), 'Ether')
                                this.props.tipImageOwner(event.target.name, tipAmount)
                                // this.forceUpdate()
                              }}
                            >
                              <img src={process.env.PUBLIC_URL + '/Images/donation.svg'} />
                            </button>
                          </div>
                          
                          <span id="donationDisp">
                             <span>Donations Raised:</span> 
                             <span>{window.web3.utils.fromWei(image.donation.toString(), 'Ether')} ETH</span>
                             </span>
                    </div>
                    );
                })}
            </div>
        );
    }
}

export default Donation;