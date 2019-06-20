import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

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
                            <br/>
                            <p className="text-muted p-2 my-1">
                                You can search for place names, review text, tags, or friends names.
                            </p>
                        </InputGroup>
                    </Form.Group>
                </Form>    

                <hr style={{border: '2px solid navy' }}/>
            
            </React.Fragment>
        )
        

  	}	
}
export default Homepage;