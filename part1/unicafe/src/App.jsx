import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  if (text == "positive") {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}%</td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const getCount = (feedbacks) => {
  let count = 0;
  feedbacks.forEach(feedback => count += feedback);
  return count;
}

const getAverage = (feedbacks) => {
  return (feedbacks[0] - feedbacks[2]) / getCount(feedbacks);
}

const getPositive = (feedbacks) => {
  return feedbacks[0] / getCount(feedbacks) * 100
}

const Statistics = ({ feedbacks }) => {
  console.log(feedbacks)
  const [good, neutral, bad] = feedbacks
  console.log(good, neutral, bad)

  if (getCount(feedbacks) == 0) {
    return <p>No feedback given</p>
  }

  return (
    <>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={getCount(feedbacks)} />
          <StatisticLine text="average" value={getAverage(feedbacks).toFixed(1)} />
          <StatisticLine text="positive" value={getPositive(feedbacks).toFixed(1)} />
        </tbody>
      </table>
    </>
  )

}

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const feedbacks = [good, neutral, bad]

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Statistics feedbacks={feedbacks} />
    </div>
  )
}

export default App