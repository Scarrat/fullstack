const Course = (props) => {
    const Header = (props) => {
        return (
          <div>
            <h1>{props.name}</h1>
          </div>
        )
      }
    
      const Content = (props) => {
        return (    
          <div>
            {props.parts.map((part) => (
                <Part key={part.id} part={part.name} exercises={part.exercises} />
             ))}
          </div>
        )
      }
      const Part = (props) => {
        return (
          <div>
            <p>
            {props.part} {props.exercises}
            </p>
          </div>
        )
      }
      const Total = (props) => {
        return (
          <div>
            <p>
              Number of exercises {props.parts.reduce((s, p) => s + p.exercises, 0)}
            </p>
          </div>
          
        )
        
      }
  
  
    return (
        <div>
          <Header name={props.course.name}/>
          <Content parts={props.course.parts}/>
          <Total parts={props.course.parts}/>
          
        </div>
      )
  
  }
  export default Course