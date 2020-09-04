import React from 'react'

interface State {
  error: any
}

type Action =
  | { type: 'SET_ERROR', payload: any}

const initialState: State = {
  error: null
}

const Store = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
})

const useStore = () => React.useContext(Store)

const reducer = (state: State, action: Action): State => {
  switch(action.type) {
    case "SET_ERROR":
      return {...state, error: action.payload}
    default:
      return state;
  }
}

const StoreProvider = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <Store.Provider value={{
      state: state,
      dispatch: dispatch
    }}>
      {children}
    </Store.Provider>
  )
}

export {StoreProvider, useStore}