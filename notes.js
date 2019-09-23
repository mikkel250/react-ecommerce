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

// 9.22 stopped at lecture 185 8:00 shows exercise he recommends writing own saga for the sign in component
