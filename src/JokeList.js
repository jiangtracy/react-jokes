import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({numJokesToGet}) {

  const [jokes, setJokes] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  
  useEffect(function getJokes() {
    if(isLoading === true){
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
  }, [isLoading, jokes]);
  

  /* Helper function to generate new jokes */
  function generateNewJokes() {
    setIsLoading(true);
  }

    /* change vote for this id by delta (+1 or -1) */

   function vote(id, delta) {

    setJokes(jokes => ({
      jokes: jokes.map( j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    }))
    }
  
  
  
  
  
  return (

  )
}

JokeList.defaultProps = {
  numJokesToGet: 5
}



class JokeList extends Component {

  /* at mount, get jokes */

  componentDidMount() {
    this.getJokes();
  }

  /* retrieve jokes from API */

  // async getJokes() {
  //   try {
  //     // load jokes one at a time, adding not-yet-seen jokes
  //     let jokes = [];
  //     let seenJokes = new Set();

  //     while (jokes.length < this.props.numJokesToGet) {
  //       let res = await axios.get("https://icanhazdadjoke.com", {
  //         headers: { Accept: "application/json" }
  //       });
  //       let { ...joke } = res.data;

  //       if (!seenJokes.has(joke.id)) {
  //         seenJokes.add(joke.id);
  //         jokes.push({ ...joke, votes: 0 });
  //       } else {
  //         console.log("duplicate found!");
  //       }
  //     }

  //     this.setState({ jokes, isLoading: false });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  /* empty joke list, set to loading state, and then call getJokes */

  // generateNewJokes() {
  //   this.setState({ isLoading: true});
  //   this.getJokes();
  // }

  /* change vote for this id by delta (+1 or -1) */

  // vote(id, delta) {
  //   this.setState(st => ({
  //     jokes: st.jokes.map(j =>
  //       j.id === id ? { ...j, votes: j.votes + delta } : j
  //     )
  //   }));
  // }

  /* render: either loading spinner or list of sorted jokes. */

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    if (this.state.isLoading) {
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
          onClick={this.generateNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(j => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={this.vote}
          />
        ))}
      </div>
    );
  }
}

export default JokeList;
