import React, {useContext, useEffect, useState} from 'react'
import {StateContext} from '../App'
import axios from 'axios'

function Display() {
  const loadData  = useContext(StateContext);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [role, setRole] = useState('');
  const [editing, setEditing] = useState(null);
  var previousId;;

  useEffect(()=>{
    
    axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
        .then(response=>{
            var ModArr=[]
            response.data.forEach(data=>{
                let obj = {...data, checked:false}
                ModArr.push(obj)
            })
            
        loadData.Dispatch({type: 'FETCH_SUCCESS', payload:ModArr , noOfPages: Math.ceil(response.data.length/10)})
        })
        .catch(err=>{
        loadData.Dispatch({type:'FETCH_ERROR'})
        })

  },[])  

  function check(booleanValue, id){
    var filteredData =loadData.modState.FilteredData 
    var found,index,arr,modObj;
    if(booleanValue == true && previousId != id){
        found = [...filteredData].find(items =>items.id == id);
        index = [...filteredData].indexOf(found);

        arr = [...filteredData]
        modObj = {...found, checked:booleanValue}
        arr.splice(index, 1, modObj)
        loadData.modState.Selected.push(modObj)
        loadData.Dispatch( {type:"SelectOne",
                            payload:arr, 
                            }
                        )
    }
    else{
        found = [...filteredData].find(items =>items.id == id);
        index = [...filteredData].indexOf(found);

        arr = [...filteredData]
        modObj = {...found, checked:booleanValue}
        arr.splice(index, 1, modObj) 
        
        var delItem=loadData.modState.Selected.find(items => items.id == id)
        var delIndex = loadData.modState.Selected.indexOf(delItem)

        loadData.modState.Selected.splice(delIndex,1);

        loadData.Dispatch( {type:"SelectOne",
                            payload:arr, 
                            }
                        )
    }
    
    previousId =id
    
   }

   function checkAll(booleanValue){
    const newArr = loadData.modState.FilteredData.slice(loadData.modState.IndexOfFirstPage,loadData.modState.IndexOfLastPage)
                                                  .map(items => {return {...items, checked:booleanValue }})                                             
    const arr = [...loadData.modState.FilteredData]
                                                 
    for(let i= 0; i< 10; i++){
        if(arr[loadData.modState.IndexOfFirstPage + i] !== undefined)
            arr.splice(loadData.modState.IndexOfFirstPage + i, 1, newArr[i] )  
    }
    
    loadData.Dispatch({type:"SelectAll", payload:arr , selected:newArr, booleanValue})

   }

  function submitEdits(id){
    var found = [...loadData.modState.FilteredData].find(items =>items.id == id)
    const index = [...loadData.modState.FilteredData].indexOf(found)

    if(name !== ''){
        found = {...found, name}
    }
    if(email !== ''){
        found = {...found, email}
    }
    if(role !== ''){
        found = {...found, role}
    }

    var arr = [...loadData.modState.FilteredData]
    arr.splice(index, 1, found)

    loadData.Dispatch({type:"Edited", payload:arr})

    setEditing(null)
    setName('')
    setEmail('')
    setRole('')
  }

  function Delete(id, name){
    
    if (window.confirm(`Are you sure you want to delete the item named ${name}`) == true) {
      let filtered = [...loadData.modState.FilteredData].filter(items => items.id !==id)
      loadData.Dispatch({type:"Delete" , payload: filtered}) 
    }
    
  }

  return (
    <div>
        <table className="table">
            <thead>
                <tr>
                    <th><input type="checkbox" 
                               onChange={(e)=>checkAll(e.target.checked)}
                               checked ={loadData.modState.Selected.length ===0 ? false:(loadData.modState.Selected.length >1 ?true :false)}/>
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th colSpan="2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {loadData.modState.FilteredData.slice(loadData.modState.IndexOfFirstPage,loadData.modState.IndexOfLastPage)
                                               .map(items=>{
                    return <tr key={items.id} style={items.checked ? { background: "#989898",color: "white"} : {}}>
                                <td><input type="checkbox" 
                                           onChange={(e)=>check(e.target.checked ,items.id)} 
                                           checked={items.checked && loadData.modState.Selected.length != 0}/></td>
                                <td>{editing === items.id ? 
                                    <input type="text" 
                                           defaultValue={items.name}
                                           onChange={(e)=>{setName(e.target.value)}} />:
                                           items.name}</td>
                                <td>{editing === items.id ?
                                     <input type="text" 
                                     defaultValue={items.email}
                                     onChange={(e)=>{setEmail(e.target.value)}} /> : 
                                     items.email}</td>
                                <td>{editing  === items.id ?
                                     <input type="text" 
                                     defaultValue={items.role}
                                     onChange={(e)=>{setRole(e.target.value)}} />:
                                     items.role}</td>
                                <td>{editing === items.id ? <button onClick={()=>submitEdits(items.id)} 
                                                                    className="pointer">
                                                                <i className="fa-sharp fa-solid fa-floppy-disk"></i>
                                                            </button>:
                                                            <button onClick={()=>setEditing(items.id)} 
                                                                    className="pointer">
                                                                <i className="fas fa-edit"></i>
                                                            </button>} </td>
                                <td><button onClick={()=>Delete(items.id, items.name)}
                                            className="pointer"><span >
                                        <i className="fa-solid fa-trash-can" 
                                           style={{color:"red"}}></i>
                                    </span></button></td>
                            </tr>
                })}
            </tbody>
        </table>

    </div>
  )
}

export default Display
