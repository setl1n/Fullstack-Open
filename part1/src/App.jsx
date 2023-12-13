const Header = (props) => {
  return (
    <>
      <h1>
        {props.course}
      </h1>
    </>
  )
}

const Part = ({ part }) => {
  const { name, exercises } = part
  console.log(name, exercises)
  return (
    <>
      <p>
        {name} {exercises}
      </p>
    </>
  )
}

const Content = (props) => {
  console.log(props.parts)
  return (
    <>
      <Part part={props.parts[0]} />
      <Part part={props.parts[1]} />
      <Part part={props.parts[2]} />
    </>
  )
}



const Total = (props) => {
  const addTotal = (arr) => {
    let res = 0;
    for (let i = 0; i < arr.length; i++) {
      res += arr[i].exercises
    }
    return res
  }
  return (
    <>
      <p>
        Number of exercises {addTotal(props.parts)}
      </p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App