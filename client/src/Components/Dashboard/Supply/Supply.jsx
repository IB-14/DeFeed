import React, { Component } from 'react';
import Web3 from 'web3';
import Supply from "../../../contracts/Supply.json"
import Identicon from 'identicon.js';


const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class SupplyCard extends Component {
    constructor(props){
        super(props)
        this.state= {
            account: this.props.account,
            supply:null,
            products:[]
        }
    }
    async componentWillMount(){
        await this.props.loadWeb3();
        await this.loadProductData();
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
    
    PayProductOwner=(id, amount)=> {
        this.state.supply.methods.payProductOwner(id).send({ from: this.state.account, value: amount }).on('transactionHash', (hash) => {
        })
    }
    
    render() {
        return (
            <div>
                <h2>Add new product</h2>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.name.value
                    const price=this.price.value
                    this.uploadImage(name,price)
                }}>
                    <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.captureFile} />
                    <input type="text" placeholder="Product name" id="name" ref={(input) => { this.name = input }}></input>
                    <input type="number" placeholder="Product price" id="price" ref={(input) => { this.price = input }}></input>
                    <button type="submit">Upload</button>
                </form>
                <br></br>
                {this.state.products.map(product=>{
                    return(
                        <div>
                        <img  src={`data:image/png;base64,${new Identicon(product.author, 30).toString()}`}/>
                        <img src={`https://ipfs.infura.io/ipfs/${product.hash}`} style={{width:'100%'}}/>
                        <p>{product.name}</p>
                        <p>{product.price}</p>
                        <button
                          name={product.id}
                          onClick={(event) => {
                            let amount = window.web3.utils.toWei(`${product.price}`, 'Ether')
                            this.PayProductOwner(event.target.name, amount)
                          }}
                        >
                          Buy
                        </button>

                    </div>
                    );
                })}
            </div>
        );
    }
}

export default SupplyCard;