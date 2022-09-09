import React, { useContext } from 'react'
import {StateContext} from '../App'

function Delete() {
  const deleteContext = useContext(StateContext)  

  var filteredData = deleteContext.modState.FilteredData;
  var selectedData = deleteContext.modState.Selected
  var originalData = deleteContext.modState.Data;
  var modArray;
  
  function deleteItems(){
    if(deleteContext.modState.Search===''){
        var newData=[...filteredData]
        if (window.confirm(`Are you sure you want to delete ${selectedData.length} items`)  == true) {
            for(let i=0; i<selectedData.length; i++){
                modArray=newData.filter(items => items.id !== selectedData[i].id)
                newData=modArray;
            }
            deleteContext.Dispatch({
                                    type:'DeleteSome',
                                    payload:newData
                                    })
          }        
    }
    else{
        var portedData = [...originalData]
        if (window.confirm(`Are you sure you want to delete ${selectedData.length} items`)  == true) {
            for(let j=0; j< selectedData.length; j++){
                modArray=portedData.filter(items => items.id !== selectedData[j].id)
                portedData=modArray;
            }
    
            deleteContext.Dispatch({
                type:'DeleteSearched',
                payload:portedData,
                triggered:1
                })
        }
    }


  }

  return (
    <div>
      <button className={deleteContext.modState.Selected.length>1 ? 'buttonActive':'buttonDisabled'}
              disabled={deleteContext.modState.Selected.length>1 ? false :true} 
              onClick={deleteItems}> Delete Selected</button>
    </div>
  )
}

export default Delete
