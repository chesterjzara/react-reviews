import React, { Component } from 'react'
import { baseAPI } from '../../App';


import Select from 'react-select';
import Form from 'react-bootstrap/Form'
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Button from 'react-bootstrap/Button';
import SuggestionItem from './SuggestionItem';


class Suggestion extends Component {
    constructor(props){
        super(props)
        this.state = {
            loadingParams : true,
            friendsOptions: [],
            friendSelection: [],
            tagOptions: [],
            tagSelection: [],
            suggestions: []
        }
    }
    
    handleSuggestionSubmit = async (event) => {
        event.preventDefault()
        let suggestionRes = await fetch(baseAPI + `/places/suggestion`, {
            method: 'POST',
            body: JSON.stringify({ 
                inFriendArray: this.state.friendSelection,
                inTagArray: this.state.tagSelection
            }),
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
        let jsonSuggestion = await suggestionRes.json()
        console.log(jsonSuggestion)

        let placeTracker = {}
        let aggregatedSuggestions = []
        jsonSuggestion.forEach( (item, index) => {
            if(item.place_id in placeTracker) {
                let index = placeTracker[item.place_id]
                let existingPlace = aggregatedSuggestions[index]
                if(existingPlace.tag_name.indexOf(item.tag_name) !== -1) {
                    existingPlace.tag_name.push(item.tag_name)
                }
                existingPlace.review_info.push({
                    user_id: item.user_id,
                    rating: item.rating,
                    review: item.review,
                    user_name: `${item.first_name} ${item.last_name}`
                })
                existingPlace.total_rating += item.rating
                existingPlace.average_rating = (existingPlace.total_rating / existingPlace.review_info.length).toFixed(1)
            } else {
                placeTracker[item.place_id] = aggregatedSuggestions.length
                aggregatedSuggestions.push({
                    entry_id: item.entry_id,
                    address: item.address,
                    google_url: item.google_url,
                    place_id: item.place_id,
                    place_name: item.place_name,
                    tag_name: [item.tag_name],
                    review_info: [
                        {
                            user_id: item.user_id,
                            rating: item.rating,
                            review: item.review,
                            user_name: `${item.first_name} ${item.last_name}`
                        }
                    ],
                    total_rating: (item.rating).toFixed(1),
                    average_rating: (item.rating).toFixed(1)
                })
            }
        } )
        console.log(aggregatedSuggestions)


        this.setState({
            suggestions: aggregatedSuggestions
        })
    }
    
    clearFriends = () => {
        console.log('Clear function!')
    }

    handleMultiChange = (options, event) => {
        console.log(options)
        console.log(event)
        if(options === null) {
            return
        }
        let newFriendsOptions = options.map( (item)=> {
            return (item.value)
        })
        console.log(newFriendsOptions)
        this.setState((prevState) => {
            return { [event.name] : newFriendsOptions }
        }, () => this.getAvailableTags())
    }

    getFriendsAndTags = async () => {
        let suggestParamRes = await fetch(baseAPI + `/friends/suggest/params`, {
            method: 'GET',
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
        let jsonParams = await suggestParamRes.json()
        console.log(jsonParams)

        this.setState({ 
            friendOptions: jsonParams,
            loadingParams : false
        })
    }
    getAvailableTags = async () => {
        let availableTagsRes = await fetch(baseAPI + `/places/suggestion/tags`, {
            method: 'POST',
            body: JSON.stringify({inFriendArray: this.state.friendSelection}),
            withCredentials: true,
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				'x-access-token' : this.props.loginUser.user_token
			}
        })
        let jsonTags = await availableTagsRes.json()
        console.log('Tags returned',jsonTags)

        this.setState({
            tagOptions: jsonTags
        })
    }
    
    componentWillMount() {
        console.log('Will render')
        this.getFriendsAndTags()
    }

    render() {
        
        if(this.state.loadingParams) {
            return ( <h1>Loading suggestion options...</h1> )
        }
        
        return (
			<React.Fragment> 
                
                <h3 className="mt-4">Friendly Suggestions</h3>
                <Form
                    onSubmit={this.handleSuggestionSubmit}
                    
                >

                    <FormGroup>
                        < FormLabel > Select your friends to get suggestions from </FormLabel>
                        <Select
                            // defaultValue={}
                            isMulti
                            clearValue={this.clearFriends}
                            name="friendSelection"
                            options={this.state.friendOptions}
                            onChange={(options, event) => this.handleMultiChange(options, event)}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            required
                        />
                    </FormGroup>
    
                    <FormGroup>
                        < FormLabel > Choose tags to narrow it down </FormLabel>
                        <Select
                            // defaultValue={}
                            isMulti
                            name="tagSelection"
                            options={this.state.tagOptions}
                            onChange={(options, event) => this.handleMultiChange(options, event)}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            noOptionsMessage={() => "Select friends to see tags they've used"}
                        />
                    </FormGroup>
                    <Button type="submit">Get suggestions!</Button>
                </Form>

                <div className="suggestion-container my-4">
                    {this.state.suggestions.map((item, index) => {
                        return (
                            < SuggestionItem
                                item={item} key={index}
                            />
                        )
                    })}

                </div>

            </React.Fragment>

		)
  	}	
}
export default Suggestion;