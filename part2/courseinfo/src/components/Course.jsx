const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) => {
  console.log(parts);
  const total = parts.reduce((s, p) => {
    if (typeof (s) == "object") {
      s = s.exercises
    }
    return s + p.exercises
  })

  return <h3>total of {total} exercises</h3>
}

const Part = ({ part }) => {
  console.log(part);
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  console.log(parts);
  return (
    <>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </>
  )
}

const Course = ({ course }) => {
  const { id, name, parts } = course
  return (
    <>
      <Header course={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </>
  )
}

export default Course