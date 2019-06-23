import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom/cjs/react-router-dom';

class Homepage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText : '',
            searchTermArray : [],
            toSearchResults : false
        }
    }
    searchChange = (event) => {
        let searchString = event.target.value
        let searchTermArray = searchString.split(' ')

        this.setState( (prevState) => {
            return {
                searchText: searchString,
                searchTermArray: searchTermArray,
            }
            
        })
    }
    redirectToSearchResults = (event) => {
        event.preventDefault()
        this.setState({
            toSearchResults: true
        })
    }

    render() {
        if(this.state.toSearchResults) {
            // let queryString = ''
            // for(let term of this.state.searchTermArray) {
            //     queryString += `${term}&`
            // }
            let queryString = this.state.searchTermArray.join('&')
            console.log(queryString)
            return < Redirect to={`/search?${queryString}`} />
        }

        if(!this.props.loginUser.user_id){
            return < Redirect to={`/welcome`} />
        }
        
        return (
			<React.Fragment>
                <h3 className='my-3'>Find Reviews and Friends</h3>
                <Form  
                    onSubmit={this.redirectToSearchResults} 
                >
                    <Form.Group>
                        <InputGroup className="my-2">
                            <Form.Control type="text" 
                                placeholder="Ex: 'Mexican', 'The Corner Bar', 'Bob'" 
                                onChange={this.searchChange}
                                value={this.state.searchText}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-success" type="submit">Search</Button>
                            </InputGroup.Append>
                            
                        </InputGroup>
                        <p className="text-muted p-2 my-1">
                                You can search for place names, review text, tags, or friends names.
                            </p>
                    </Form.Group>
                </Form>    

                <hr style={{borderBottom: '2px solid navy' }}/>
                <h3>Can't decide?</h3>
                <div className="grid-container">
                    <img src="./img/tacos.jpg" alt=""/>
                    <img src="./img/pho.jpg" alt=""/>
                    <img src="./img/drinks.jpg" alt=""/>
                    <img src="./img/museum.jpg" alt=""/>
                    <Link  to='/suggestion'> 
                        <Button id="suggestion-button"> 	
                            Let us make a suggestion! 
                        </Button> 
                    </Link>
                    <img src="./img/pasta.jpg" alt=""/>
                    <img src="./img/zoo.jpg" alt=""/>
                    <img src="./img/coffee.jpg" alt=""/>
                    <img src="./img/symphony.jpg" alt=""/>
                    
                </div>
                

            </React.Fragment>
        )
        

  	}	
}
export default Homepage;