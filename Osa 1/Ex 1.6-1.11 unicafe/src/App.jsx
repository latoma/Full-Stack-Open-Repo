import { useState } from 'react'

const Title = ({text}) => <h1>{text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>


const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  if (total === 0) {
    return <p>No feedback given</p>
  }
  return (
    <table>
      <thead>
        <tr>
          <td>
            <Title text='statistics' />
          </td>
        </tr>
      </thead>
      <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />

        <StatisticLine text='average' value={(good - bad) / total} />
        <StatisticLine text='positive' value={(good / total) * 100 + '%'} />
      </tbody>
    </table>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Title text='give feedback' />
      <Button handleClick={handleGoodClick} text='Good' />
      <Button handleClick={handleNeutralClick} text='Neutral' />
      <Button handleClick={handleBadClick} text='Bad' />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}
export default App
