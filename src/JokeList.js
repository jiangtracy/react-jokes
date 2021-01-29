import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes.
 * 
 * props: 
 *  numJokesToGet: default is 5
 * states:
 *  jokes : [joke, ...]
 *  isLoading: T/F
 * 
 * App -> JokeList ->Joke
 */

function JokeList({ numJokesToGet }) {

  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function getJokes() {
    async function getJokesFromApi() {
      try {
        // load jokes one at a time, adding not-yet-seen jokes
        let jokes = [];
        let seenJokes = new Set();

        while (jokes.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...joke } = res.data;

          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            jokes.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }
        setJokes(jokes);
        setIsLoading(false);

      } catch (err) {
        console.error(err);
      }
    }
    if (isLoading === true) {
      getJokesFromApi();
    }
  }, [isLoading, numJokesToGet]);


  /* Helper function to generate new jokes */
  function generateNewJokes() {
    setIsLoading(true);
  }

  /* change vote for this id by delta (+1 or -1) */
  function vote(id, delta) {
    const updatedJokes = jokes.map(j =>
      j.id === id ? { ...j, votes: j.votes + delta } : j)
    const sortedJokes = [...updatedJokes].sort((a, b) => b.votes - a.votes);
    setJokes(jokes => (sortedJokes));
  }

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  return (

    <div className="JokeList">
      <button
        className="JokeList-getmore"
        onClick={generateNewJokes}
      >
        Get New Jokes
    </button>

      {jokes.map(j => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>

  )
}

JokeList.defaultProps = {
  numJokesToGet: 5
}

export default JokeList;
