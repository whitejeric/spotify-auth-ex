import { useEffect, useState } from 'react';
import SpotifyWebApi, { createAuthorizeURL } from 'spotify-web-api-node';
import './App.css';
import reactLogo from './assets/react.svg';

import credentials from '../public/credentials.json';
{
	type: 'JSON';
}

const CLIENT_ID = credentials.clientId;
const REDIRECT_URI = credentials.redirectUri;
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

var logged = false;

const SCOPES = 'user-read-private';

const spotifyApi = new SpotifyWebApi({
	redirectUri: REDIRECT_URI,
	clientId: CLIENT_ID,
});

function App() {
	useEffect(() => {
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
		window.location.hash = '';
	}, []);

	const authorize_url = () => {
		return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scopes=${SCOPES}&response_type=${RESPONSE_TYPE}`;
	};
	const getUser = () => {
		spotifyApi.getMe().then(
			function (data) {
				console.log('Some information about the authenticated user', data.body);
			},
			function (err) {
				console.log('Something went wrong!', err);
			}
		);
	};
	const logout = () => {
		console.log('Token = ' + spotifyApi.setAccessToken(''));
		window.localStorage.removeItem('token');
	};

	return (
		<div className="App">
			{/* <a
				href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
			>
				Login to Spotify
			</a> */}
			<button onClick={logout}>logout</button>
			<button>
				<a href={authorize_url()}>login</a>
			</button>
			<button onClick={getUser}>User</button>
		</div>
	);
}

export default App;
