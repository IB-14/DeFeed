import React, { Component } from 'react';
import Supply from "../../../../contracts/Supply.json"
import Web3 from 'web3';

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class AddSupply extends Component {
    constructor(props){
        super(props)
        this.state= {
            account: this.props.account,
            supply:null,
            products:[]
        }
    }

    async componentWillMount(){
        await this.loadWeb3();
        await this.loadProductData();
    }
    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
    async loadProductData(){
        const web3=window.web3
        const networkID= await web3.eth.net.getId()
        const networkData=Supply.networks[networkID]
        if(networkData){

          //supply contract
          const supply=new web3.eth.Contract(Supply.abi,networkData.address);
          this.setState({supply:supply})
          const productsCount= await supply.methods.productCount().call()
          this.setState({productsCount})
          console.log(productsCount)
          for (var i = 1; i <= productsCount; i++) {
            const product = await supply.methods.products(i).call()
            this.setState({
              products: [...this.state.products, product]
            })
          }
          console.log(this.state.products)


        } else{
          window.alert("supply contract not deployed")
        }
      }

    captureFile = event => { //pre processing file
    
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
    
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('buffer', this.state.buffer)
        }
      }

      uploadImage = (name,price) => {
        console.log("Submitting file to ipfs...")
        //adding file to the IPFS
        ipfs.files.add(this.state.buffer, (error, result) => {
            console.log(result[0].hash)
          if(error) {
            console.error(error)
            return
          }
          this.state.supply.methods.uploadProduct(result[0].hash, name,price).send({ from: this.state.account }).on('transactionHash', (hash) => {
          })
        })
      }

    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                const name = this.name.value
                const price=this.price.value
                this.uploadImage(name,price)
            }}>
                <div className="RaiseDon">
                    <div className="trrp">
                        <span className="addPostTexts">
                            ENTER PHONE NO.
                        </span>
                        <label id="phLabel">
                        Phone number is required so that buyer can contact you for delivery details
                        </label>
                        <input type="number" step="any" id="waste" className="txtArea2" ref={(input) => { this.name = input }}/>
                    </div>
                    <div className="flexForEth2">
                        <div className="trrp">
                            <span className="addPostTexts">
                                SHARE IMAGE 
                            </span>
                            <input id="imgupl" className="imgUpload" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.captureFile} />
                            <label for="imgupl" id="imguplbl">
                                <svg width="62" height="65" viewBox="0 0 62 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M28.1581 0H33.5386C34.0169 0 34.256 0.239135 34.256 0.717404V63.849C34.256 64.3272 34.0169 64.5664 33.5386 64.5664H28.1581C27.6798 64.5664 27.4407 64.3272 27.4407 63.849V0.717404C27.4407 0.239135 27.6798 0 28.1581 0Z" fill="white"/>
                                <path d="M0.717404 28.8755H60.9794C61.4576 28.8755 61.6968 29.1146 61.6968 29.5929V34.9734C61.6968 35.4517 61.4576 35.6909 60.9794 35.6909H0.717404C0.239135 35.6909 0 35.4517 0 34.9734V29.5929C0 29.1146 0.239135 28.8755 0.717404 28.8755Z" fill="white"/>
                                </svg>
                            </label>
                        </div>
                        <div className="trrp">
                        <span className="addPostTexts">
                            PRICE (IN ETH)
                        </span>
                        <input className="ethAmt"  type="number" ref={(input) => { this.price = input }}/>
                    </div>
                    </div>
                    <button type="submit" className="postBut">
                        POST
                    </button>
                </div>
            </form>
        );
    }
}

export default AddSupply;