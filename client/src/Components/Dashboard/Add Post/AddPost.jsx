import React, { Component } from 'react';
import AddSupply from "./Add Supply/AddSupply"
import "./Add.css"

class AddPost extends Component {
    constructor(props){
        super(props)
        this.state= {
          addPost: "donation"
        }
    }

    // upldImage(des) {
    //   this.props.uploadImage(des)
    // }

    changeAddOption(s) {
      this.setState({addPost: s})
    }

    render() {

      let post, active1, active2;
      if(this.state.addPost==="donation") {
        
        
        post=
        
        <form onSubmit={(event) => {
          event.preventDefault()
          const description = this.imageDescription.value
          this.props.uploadImage(description)
          this.props.forceUpdate();
      }} >
        <div className="RaiseDon">
      
          <div className="trrp">
              <span className="addPostTexts">
                  ADD A DESCRIPTION
              </span>
              <textarea className="txtArea" ref={(input) => { this.imageDescription = input }}/>
          </div>
          
          <div className="trrp">
            <span className="addPostTexts">
                SHARE IMAGE 
            </span>
            <input id="imgupl" className="imgUpload" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
            <label for="imgupl" id="imguplbl">
                <svg width="62" height="65" viewBox="0 0 62 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.1581 0H33.5386C34.0169 0 34.256 0.239135 34.256 0.717404V63.849C34.256 64.3272 34.0169 64.5664 33.5386 64.5664H28.1581C27.6798 64.5664 27.4407 64.3272 27.4407 63.849V0.717404C27.4407 0.239135 27.6798 0 28.1581 0Z" fill="white"/>
                <path d="M0.717404 28.8755H60.9794C61.4576 28.8755 61.6968 29.1146 61.6968 29.5929V34.9734C61.6968 35.4517 61.4576 35.6909 60.9794 35.6909H0.717404C0.239135 35.6909 0 35.4517 0 34.9734V29.5929C0 29.1146 0.239135 28.8755 0.717404 28.8755Z" fill="white"/>
                </svg>
            </label>
        </div>

          <button type="submit" className="postBut">
              POST
          </button>
        </div>
      </form>



        
          active1= "active";
        }




      else if(this.state.addPost==="supply") {
        post= <AddSupply account={this.props.account} />
        active2= "active";
      }




        return (
            <div className="addWrap">
              <div className="addLeft">
                <div className="topAddBar">
                  <div className={active1} id="topDivAdd" onClick={()=>{this.changeAddOption("donation")}}>
                    RAISE DONATIONS
                  </div>
                  <div className={active2} id="topDivAdd" onClick={()=>{this.changeAddOption("supply")}}>
                    SUPPLY
                  </div>
                </div>
                <div className="addPostBoard">
                  
                  
                  {post}



                </div>
              </div>
              <div className="mobImg">
                <img id="mobVect" src={process.env.PUBLIC_URL + '/Images/mob_vector.svg'} />
              </div>
            </div>
        );
    }
}

export default AddPost;






