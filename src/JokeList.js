import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';
import useLocalStorage from './useLocalStorage';

/** List of jokes.
 * 
 * props: 
 *  numJokesToGet: default is 5
 * states:
 *  jokes : [joke, ...]
 *  isLoading: T/F
 *  lockedJokes : [jokes, ...]
 * 
 * App -> JokeList ->Joke
 */

function JokeList({ numJokesToGet }) {
  //add an isLocked to jokes, centralize
	const [ jokes, setJokes ] = useLocalStorage('jokes', []);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ lockedJokes, setLockedJokes ] = useLocalStorage('lockedJokes', []);

	useEffect(
		function getJokes() {
			async function getJokesFromApi() {
				if (jokes.length === 0) {
					try {
            // load jokes one at a time, adding not-yet-seen jokes
            // be cautious with naming, jokes already in state. shadowing
            //pick a different name for line 32 jokes
            //filter out locked jokes from jokes state instead of keeping another state lockedJoke
						let jokes = [ ...lockedJokes ];
						let seenJokes = new Set();

						while (jokes.length < numJokesToGet) {
							let res = await axios.get('https://icanhazdadjoke.com', {
								headers: { Accept: 'application/json' }
							});
							let { ...joke } = res.data;
              
							if (!seenJokes.has(joke.id)) {
								seenJokes.add(joke.id);
								jokes.push({ ...joke, votes: 0 });
							} else {
								console.log('duplicate found!');
							}
						}
						setJokes(jokes);
					} catch (err) {
						console.error(err);
					}
				}
				setIsLoading(false);
			}
			if (isLoading === true) {
				getJokesFromApi();
			}
		},
		[ isLoading, numJokesToGet, setJokes, jokes.length, lockedJokes ]
	);

	/* Helper function to generate new jokes */
	function generateNewJokes() {
		setJokes([]);
		setIsLoading(true);
	}

	/* handle reset button click, sets all votes to 0 */
	function resetVotes() {
    const resetedJokes = jokes.map((j) => ({ ...j, votes: 0 }));
    //should use callback, depending on previous state
		setJokes(resetedJokes);
	}

	/* Toggle lock/unlock for a joke and update the lockedJoke array  */
	function toggleLockJoke(id) {
		if (lockedJokes.find((j) => j.id === id)) {
			setLockedJokes((lockedJokes) => lockedJokes.filter((j) => j.id !== id));
		} else {
			const lockedJoke = jokes.find((j) => j.id === id);
			setLockedJokes((lockedJokes) => [ ...lockedJokes, lockedJoke ]);
		}
	}
	/* change vote for this id by delta (+1 or -1) */
	function vote(id, delta) {
		const updatedJokes = jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j));
		const sortedJokes = updatedJokes.sort((a, b) => b.votes - a.votes);
		setJokes(sortedJokes);
	}

	if (isLoading) {
		return (
			<div className="loading">
				<i className="fas fa-4x fa-spinner fa-spin" />
			</div>
		);
	}

	return (
		<div className="JokeList">
			<button className="JokeList-getmore" onClick={generateNewJokes}>
				Get New Jokes
			</button>

			<button className="JokeList-reset" onClick={resetVotes}>
				reset the votes
			</button>

			{jokes.map((j) => (
				<Joke
					text={j.joke}
					key={j.id}
					id={j.id}
					votes={j.votes}
					vote={vote}
					toggleLock={toggleLockJoke}
					isLocked={lockedJokes.some((l) => l.id === j.id)}
				/>
			))}
		</div>
	);
}

JokeList.defaultProps = {
	numJokesToGet: 5
};

export default JokeList;
