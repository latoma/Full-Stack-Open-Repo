const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}

const Content = (props) => {
  console.log(props)
  const parts = props.parts
  return (
    <>
      {parts.map(part =>
        <Part 
          key={part.id}
          part={part.name}
          exercises={part.exercises}
        />
      )}
    </>
  )
}

const Total = (props) => {
  const sum = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <>
      <p><strong>Total of {sum} exercises</strong></p>
    </>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content 
        parts={course.parts}
      />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course