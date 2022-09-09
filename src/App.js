import React,{ useReducer,useRef } from 'react';
import './App.css';
//Code for reducers Admin_UI

import Display from './Components/Display';
import Pagination from './Components/Pagination';
import Search from './Components/Search';

export const StateContext = React.createContext()

const initialState={
  Data:[],
  FilteredData:[],
  Search:'',
  FirstPage:1,
  NoOfPages:0,
  CurrentPage:1,
  IndexOfFirstPage:0,
  IndexOfLastPage:0,
  Selected:[],
  Triggered:0,
}

const reducer = (state, action)=>{
    switch(action.type){
      case 'FETCH_SUCCESS':
        return {
          ...state,
          Data:action.payload,
          FilteredData:action.payload,
          NoOfPages:action.noOfPages
        }
      case 'FETCH_ERROR':
        return {
          ...state,
          Data:[]
        }
      case 'Search':
        return {
          ...state,
          Search:action.payload,
          FilteredData:[...state.Data].filter(item =>
              (item.name.toLowerCase().includes(action.payload.toLowerCase())||
               item.email.toLowerCase().includes(action.payload.toLowerCase())||
               item.role.toLowerCase().includes(action.payload.toLowerCase()) )
               ),
          NoOfPages:Math.ceil(([...state.Data].filter(item =>
            (item.name.toLowerCase().includes(action.payload.toLowerCase())||
             item.email.toLowerCase().includes(action.payload.toLowerCase())||
             item.role.toLowerCase().includes(action.payload.toLowerCase()) )
             ).length )/10),
          IndexOfFirstPage:action.FI,
          IndexOfLastPage:action.LI,
          Selected:[]        
        }
      case 'onLoad':
        return {
          ...state,
          IndexOfFirstPage:action.FI,
          IndexOfLastPage:action.LI
        }
      case 'typeChanged':
        return {
          ...state,
          IndexOfFirstPage:action.FI,
          IndexOfLastPage:action.LI,
          CurrentPage:action.CurrentPage,
          Selected:[],
        }
      case 'SelectOne':
        return {
          ...state,
          FilteredData:[...action.payload],
        }
      case 'SelectAll':
        return {
          ...state,
          FilteredData:[...action.payload],
          Selected:action.booleanValue?[...action.selected] :[],
        }
      case 'removeCheckOnPageChange':
        return {
          ...state,
          FilteredData:[...action.payload],
        }      
      case 'Edited':
        return {
          ...state,
          FilteredData:[...action.payload],
          Data:[...action.payload]
        }  
      case 'Delete':
        return {
          ...state,
          FilteredData:[...action.payload],
          Data:[...action.payload],
          NoOfPages:Math.ceil([...action.payload].length/10)
        }
      case 'DeleteSome':
        return {
          ...state,
          FilteredData:[...action.payload],
          Data:[...action.payload],
          NoOfPages:Math.ceil([...action.payload].length/10),
          Selected:[]
        }  
      case 'DeleteSearched':
        return {
          ...state,
          FilteredData:[...action.payload],
          Data:[...action.payload],
          NoOfPages:Math.ceil([...action.payload].length/10),
          Selected:[],
          Search:'',
          Triggered:action.triggered
        }    
      default:
        return state    
    }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const serachRef = useRef(null);

  if(state.Triggered == 1){
    serachRef.current.value=''
    state.Triggered =0
  }

  return (
    <div className='App'>
      <StateContext.Provider value={{modState:state, Dispatch:dispatch }}>
          <Search ref={serachRef} />
          <Display/>
          <Pagination/>
      </StateContext.Provider>
    </div>
  );
}

export default App;

