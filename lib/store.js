import React, { useContext } from 'react'

export function store(defaultValues = {}) {
  // a component for storing the modified values of the context
  class Provider extends React.PureComponent {
    constructor(props) {
      super(props)

      // insert default state
      this.state = storeMethods.setStore === setStore ? defaultValues : Provider.get()

      storeMethods.setStore = this.setState.bind(this) // update the setStore function to modify this store
      storeMethods.getStore = () => this.state
    }

    render() {
      return (
        <Context.Provider value={this.state}>
          {this.props.children}
        </Context.Provider>
      )
    }
  }

  // set up the context and methods to modify it
  const Context = React.createContext(defaultValues)

  let setStore = () => { throw new Error("Cannot call `setState` on a store before the provider component has been initialized. If you're attempting to use `set()` to set initial values, you can instead provide them the `store(defaultValues)` constructor.") }
  let getStore = () => defaultValues
  let useStore = () => useContext(Context)

  let storeMethods = { setStore, getStore, useStore }

  /**
   * Set the value of the store. Behaves identically to a React's `setState` functions.
   */
  Provider.set = Provider.setStore = (...args) => storeMethods.setStore(...args)

  /**
   * Returns the current value of the store.
   */
  Provider.get = Provider.getStore = () => storeMethods.getStore()

  /**
   * A `useStore` hook for functional components. Returns the current value of the store and triggers updates in functional components. Usage outside of functional components will throw errors.
   */
  Provider.use = Provider.useStore = () => storeMethods.useStore()

  // Expose the context so that it can be used in unforseen circumstances.
  Provider.context = Context

  return Provider
}
