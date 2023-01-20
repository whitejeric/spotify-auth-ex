import { useRef, useState } from 'react';
//example of useState hook
function User() {
	const [count, setCount] = useRef(0);
	// count is the variable, setCount the function, init at 0
	return (
		<div>
			<h1>useState</h1>
			<p>updates ui</p>
			<button onClick={() => setCount(count + 1)}>{count}</button>
		</div>
	);
}

export default User;
