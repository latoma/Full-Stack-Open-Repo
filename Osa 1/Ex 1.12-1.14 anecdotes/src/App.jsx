import { useState } from 'react'

const Title = ({text}) => <h1>{text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Anecdote = ({anecdotes, selected}) => {
  return (
    <div style={{ height: '120px', width: '400px', textAlign: 'left' }}>
      {anecdotes[selected].text}
      <p>(Has {anecdotes[selected].votes} votes.)</p>
    </div>
  )
}

const MostVotedAnecdote = ({anecdotes}) => {
  let maxVotes = 0
  let maxIndex = 0
  anecdotes.forEach((anecdote, index) => {
    if (anecdote.votes > maxVotes) {
      maxVotes = anecdote.votes
      maxIndex = index
    }
  })
  if (maxVotes === 0) {
    return (
      <p>No votes yet</p>
    )
  } else {
  return (
    <Anecdote anecdotes={anecdotes} selected={maxIndex}/>
  )}
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      text: 'If it hurts, do it more often.',
      votes: 0
    },
    {
      text: 'Adding manpower to a late software project makes it later!',
      votes: 0
    },
    {
      text: 'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
      votes: 0
    },
    {
      text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
      votes: 0
    },
    {
      text: 'Premature optimization is the root of all evil.',
      votes: 0
    },
    {
      text: 'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
      votes: 0
    },
    {
      text: 'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
      votes: 0
    },
    {
      text: 'The only way to go fast, is to go well.',
      votes: 0
    }
  ])
   
  const [voted, setVoted] = useState(false)
  const [selected, setSelected] = useState(0)

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

  const handleClickNext = () => {
    let newIndex = selected
    while (newIndex === selected) {
      newIndex = getRandomInt(anecdotes.length)
    }
    setSelected(newIndex)
    setVoted(false)
  }

  const handleClickVote = () => {
    if (voted) {
      console.log("Already voted")
      return
    }
    const newAnecdotes = [...anecdotes]
    newAnecdotes[selected].votes += 1
    setAnecdotes(newAnecdotes)

    setVoted(true)
  }

  return (
    <div>
      <Title text={"Vote for anecdote of the day"}/>
      <Anecdote anecdotes={anecdotes} selected={selected}/>
      <div>
        <Button handleClick={handleClickNext} text={"Next anecdote"}/>
        <Button handleClick={handleClickVote} text={"Vote"}/>
      </div>
      <Title text={"Anecdote with most votes"}/>
      <MostVotedAnecdote anecdotes={anecdotes}/>

    </div>
  )
}

export default App