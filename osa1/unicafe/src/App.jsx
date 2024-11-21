import { useState } from 'react'

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
   return <p>No feedback given</p>;
  }

  return ( 
    
    <table>
      <tbody>
      <StatisticLine text="Good" value ={props.good} />
      <StatisticLine text="Neutral" value ={props.neutral} />
      <StatisticLine text="Bad" value ={props.bad} />
      <StatisticLine text="All" value ={props.total} />
      <StatisticLine text="Average" value ={((props.good * 1 + props.bad * -1) / props.total)} />
      <StatisticLine text="Positive" value={`${((props.good / props.total) * 100).toFixed(1)}%`} />
      </tbody>
  </table>
  )
 
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total =  good + neutral + bad;


  return (
    <div>
      <h2>Give feedback</h2>
      <Button onClick={() => setGood(good + 1)}text="Good" ></Button>
      <Button onClick={() => setNeutral(neutral + 1)}text="Neutral" ></Button>
      <Button onClick={() => setBad(bad + 1)}text="Bad" ></Button>

      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
      

    </div>
  )
}

export default App