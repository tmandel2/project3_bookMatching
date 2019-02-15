import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import EditUser from '../EditUser';

class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: this.props.user.username,
            newUsername: '',
            user: this.props.user,
            userData: '',
            showModal: false
        }
    }
    getUser = async (id)=>{
        try{
            const foundUser = await fetch(`http://localhost:9000/users/${id}`, {
            method: 'GET',
            credentials: 'include'
            })
            if(!foundUser.ok){
                throw Error(foundUser.statusText);
            }
            const parsed = await foundUser.json();
            console.log(parsed);
            this.setState({
                userData: parsed
            })
        }catch(err){
            console.log(err);
            return err;
        }
    }
    deleteUser = async (id)=>{
        try{
            const response = await fetch(`http://localhost:9000/users/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if(!response.ok){
                throw Error(response.statusText);
            }
            this.props.history.push('/')
        }catch(err){
            console.log(err);
            return err;
        }
    }
    showModal = (e)=>{
        this.setState({
            showModal: true
        })
    }
    handleEditInput = (e)=>{
        this.setState({
            newUsername: e.target.value
        })
    }
    editUser = async (data, e)=>{
        e.preventDefault();
        try{
            const response = await fetch(`http://localhost:9000/users/${this.state.user._id}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify({"username":data}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                throw Error(response.statusText);
            }
            const parsed = await response.json();
            console.log(parsed, '   parsed edit data');
            this.setState({
                showModal: false,
                username: parsed.data.username
            })

        }catch(err){
            console.log(err);
            return err;
        }
    }
    deleteBook = async (id)=>{
        const response = await fetch(`http://localhost:9000/users/books/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        if(!response.ok){
            throw Error(response.statusText);
        }
        const parsed = await response.json();
        this.setState({
            user: parsed.data
        })
        this.getUser(this.state.user._id);
    }
    componentDidMount(){
        this.getUser(this.state.user._id);
    }
    render(){
        console.log(this.state, '  state from profile');
        const likedBooks = this.state.userData.length === 0 ? 'None' : this.state.userData.data.likedBooks.map((book)=>{
            return(
                <ul key={book._id} className="liked-books">
                    <li><img src={book.image} alt={book.image}/></li>
                    <li>{book.title}</li>
                    <li>by: {book.author}</li>
                    <li><button onClick={this.deleteBook.bind(null, book._id)}>Remove from Favorites</button></li>
                </ul>
            )
        });
        return(
            <div>
                <h1>{this.state.username}'s Profile</h1>
                <button onClick={this.showModal} >Edit Profile</button>
                {this.state.showModal ? <EditUser editUser={this.editUser} handleEditInput={this.handleEditInput} username={this.state.username} newUsername={this.state.newUsername}/> : null}
                <button onClick={this.deleteUser.bind(null, this.state.user._id)} >Delete your Account</button>
                <h3>Your Favorite Books</h3>  <br/> 
                {likedBooks}
                
                

            </div>
        )
    }
}
export default withRouter(Profile);