import React, { Component } from 'react'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// import { baseAPI } from '../../App';

class FriendRequests extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}

	}
	
	render() {
		console.log('Friend Request render')
		return (
			<Accordion>
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey="0">
						Your Friends Requests ({this.props.pendingArray.length})
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="0">
						<Card.Body>
							<ListGroup variant="flush">
								{this.props.pendingArray.map( (item, index) => { 
									return (
										<ListGroup.Item key={index}> 
											< Row> 
												<Col>
													{item.first_name} {item.last_name} 
												</Col>
												<Col bsPrefix="testing-col">
													<Button size="sm" variant="danger"
														onClick={() => this.props.deleteFriend(item.user_id, "pendingArray", index)}
													> Decline </Button>
													<Button size="sm" variant="success"
														onClick={() => this.props.acceptRequest(item.user_id) }
													>Success</Button>
												</Col>
											</Row> 
										</ListGroup.Item>
										)
								})}
							</ListGroup>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey="1">
						Your Sent Requests ({this.props.sentArray.length})
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="1">
						<Card.Body>
							<ListGroup variant="flush">
								{this.props.sentArray.map( (item, index) => { 
									return (
										<ListGroup.Item key={index}>
											< Row> 
												<Col>
													<h6>
														{item.first_name} {item.last_name}
													</h6> 
												</Col>
												<Col bsPrefix="testing-col">
													<Button size="sm" variant="danger"
														onClick={() => this.props.deleteFriend(item.user_id, "sentArray", index)}
													> Cancel </Button>
													
												</Col>
											</Row>
										</ListGroup.Item>)
								})}
							</ListGroup>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		)
  	}	
}
export default FriendRequests;