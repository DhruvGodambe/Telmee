import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {globalContext} from './globalContext';
import Cookies from 'js-cookie';
import User from './pages/user/user';

export function AuthEditUser({component: EditUser, ...rest}){

	return(
		<Route
			render={(props) => (
				Cookies.get('userID') === props.match.params.userid ?
				<Redirect to='/'/> :
				<EditUser {...props}/>
			)}
		/>
	)
}

export function AuthMyUser({component: MyUser, ...rest}){	
	return(
		<Route
			render={(props) => {
				return Cookies.get('userID') === window.location.href.split('user/')[1] ?
				<MyUser {...props}/> :
				<User {...props}/> 
			}}
		/>
	)
}

export function AuthLogin({component: Login, ...rest}){
	const {loggedIn, currentUser } = useContext(globalContext);

	return(
		<Route
			render={(props) => (
				loggedIn ? 
				<Redirect to={`/user/${currentUser.id}`} /> :
				<Login {...props}/>
			)}
		/>
	)
}