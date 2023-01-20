import { useEffect, useRef, useState } from 'react';
import SpotifyWebApi, { createAuthorizeURL } from 'spotify-web-api-node';
import './App.css';
import reactLogo from './assets/react.svg';
// import User from './User';

import credentials from '../public/credentials.json';
{
	type: 'JSON';
}

const CLIENT_ID = credentials.clientId;
const REDIRECT_URI = credentials.redirectUri;
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

var logged = false;

const SCOPES = 'user-read-private%20user-read-email';

const spotifyApi = new SpotifyWebApi({
	redirectUri: REDIRECT_URI,
	clientId: CLIENT_ID,
});

function App() {
	const [login_status, setLogoutStatus] = useState(false);
	const user_details = useRef(null);
	const [user_info, setInfo] = useState();
	const [playlists, setPlaylists] = useState();

	useEffect(() => {
		console.log('loading with logged out status: ' + login_status);
		if (!login_status) {
			const hash = window.location.hash;
			let token = window.localStorage.getItem('token');
			if (!token && hash) {
				token = hash
					.substring(1)
					.split('&')
					.find((elem) => elem.startsWith('access_token'))
					.split('=')[1];

				window.localStorage.setItem('token', token);
			}
			spotifyApi.setAccessToken(token);
			console.log('Token = ' + spotifyApi.getAccessToken());
			document.title = 'Logged In';
		}
	}, [login_status]);

	const authorize_url = () => {
		return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scopes=${SCOPES}&response_type=${RESPONSE_TYPE}`;
	};
	function getUser() {
		console.log('Get user:');
		spotifyApi.getMe().then(
			function (data) {
				user_details.current = data.body;
				console.log(user_details.current);
				setInfo(user_details.current);
			},
			function (err) {
				console.log('Something went wrong!', err);
			}
		);
	}

	function play(lim, off) {
		spotifyApi
			.getUserPlaylists('22ojmatimcnwpydlbntoahcgy', {
				limit: lim,
				offset: off,
			})
			.then(
				function (data) {
					return data.body.items;
				},
				function (err) {
					console.log('Something went wrong!', err);
				}
			);
		return 'asd';
	}
	function getPlaylists() {
		let m = 0;
		let items = {};
		console.log('Get playlists:');
		const max = 50;
		let frame = 0;
		for (let i = 0; i < 1000000; i++) {
			// frame = i % 50000;
			setTimeout(() => {
				console.log('5 seconds'), 5000;
			});
			if (frame == 0) {
				play(max, 50 * m);
				m += 1;
				console.log(m);
			}
		}
	}
	const logout = () => {
		setLogoutStatus(true);
		console.log('Token = ' + spotifyApi.setAccessToken(''));
		console.log(login_status);
		window.localStorage.removeItem('token');
		window.location.hash = '';
		setInfo();
		document.title = 'Logged Out';
	};

	const login = () => {
		console.log('Logging in...');
		setLogoutStatus(true);
	};

	function printPlayLists() {}

	return (
		<div className="App">
			{!login_status ? (
				<>
					<button onClick={logout}>logout</button>
				</>
			) : (
				<a href={authorize_url()}>
					<button onClick={login}>login</button>
					{/* <User /> */}
					{/* <a href={authorize_url()}>login</a> */}
				</a>
			)}
			{!user_info && !login_status ? (
				<>
					<button onClick={getUser}>Get User</button>
				</>
			) : (
				<div>
					<h2>{user_info ? user_info.display_name : ''}</h2>
					<button onClick={getPlaylists}>Get playlists</button>
					<p></p>
				</div>
			)}
		</div>
	);
}

export default App;
