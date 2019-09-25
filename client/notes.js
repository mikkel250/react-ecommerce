//The original way the setState was set up(in the monsters version) was: 

onChange = {event => {
  //note: below, the console is set to be an anonymous callback bc otherwise it will be one letter behind the current state, since the setState is asynchronous, the console.log was actually called _before_ the state was updated. to get around this, you use an anonymous (callback) function to call console log, and it updates at the same time as the setState
  this.setState({ searchField: event.target.value }, () => console.log(this.state)
  );
}}

// So the above is not actually best practice.
// Best way to do this is using the below syntax in case the state is being updated by another part of the app as well:
// see lecture 46 for a refresher
handleClick = () => {
  this.setState((prevState, prevProps) => {
    return { meaningOfLife: prevState.meaningOfLife + 1}
  },
    console.log(this.state.meaningOfLife)
  )
}

// Array Destructuring
// if you want to set each element in an array to a variable, you can do so by using the method below
const arr = [1, 2, 3] // declare an array (or use an existing)
const [first, second, third] = arr   //this set first to 1, second to two, etc. these can be any variable names you want
first // 1
second //2  etc


// HOOKS - lecture 187, 189
// hooks gives you some new methods that can be used, one of which is useState. This gives functional compnents access to state similat to the way class components do. useState gives you back two parameters inside of an array, so you would destructure them out in your app. e.g.
import React, { useState } from 'react';

const UseStateExample = () => {
  // const [name, setName] = useState();
  // var you want your state to hold, and a function that allows you to set the (first) property
  // so in the example above, you want to hold a name, and the function will set the name

  // to use the above example, you would write it like so to set the name to 'Yihua' initially
  // note that whenever useState is called, the render method is called (the component rerenders) -- it is essentially the same a setState in a class component
  const [name, setName] = useState('Yihua');

  return (
    <Card>
      <h1> {name} </h1>
      <button onClick={() => setName('Andrei')}> Set Name to Andrei </button>
    </Card>
  );
};

// =====================================================
// useEffect is another hook. It does not return back any value. It gets a function that is called whenever the component changes/rerenders.
// useEffect mimics the 'componentDidMount' lifecycle method, but can be set to only fire in specific circumstances, by passing it a second parameter (an array that contains all of the properties that we want to watch. An empty array will cause it to only fire once when the component is mounted). See example below

const UseEffectExample = () => {
  const [user, setUser] = useState(null); // set the user to null initially
  const [searchQuery, setSearchQuery] = useState('Bret')  // set the search query to 'Bret' initally

  useEffect(() => {
    console.log('user found'); // do this code when useEffect is fired
  }, [user]);  // fire the useEffect only when the parameter inside the array (user, in this case) is updated. Usually the two would be linked..meaning that you would want the parameters/properties to be something your useEffect function is dependant upon
}

// how to set up an async call with useEffect
// useEffect expects a pure function, so you can't just call async inside of it, you need to wrap it inside a function like the below example where we're fetching the username from the json placeholder API
  useEffect(() => {
    const fetchFunc = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users?username=${searchQuery}`);
      const resJson = await response.json();
      setUser(resJson[0]); // the API returns an array, so we're just pulling the first item out
    }
    fetchFunc();

  }, [searchQuery]); 

return (
  // your component/UI code here 
)
// 9.22 stopped at lecture 185 8:00 shows exercise he recommends writing own saga for the sign in component


