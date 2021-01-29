import React from 'react';
import './Joke.css';

/** Render a single joke, along with vote up/down buttons. 
 * props: 
 * - an object like { id, vote, votes, text }
 * state: 
 * -none
 * JokeList -> Joke
*/

function Joke({ id, vote, votes, text, lock}) {
	return (
		<div className="Joke">
			<div className="Joke-votearea">
				<button onClick={(evt) => vote(id, +1)}>
					<i className="fas fa-thumbs-up" />
				</button>

				<button onClick={(evt) => vote(id, -1)}>
					<i className="fas fa-thumbs-down" />
				</button>

				<button onClick={(evt) => lock}>
				<i className="fas fa-lock"></i>
				</button>

				{votes}
			</div>

			<div className="Joke-text">{text}</div>
		</div>
	);
}

export default Joke;
