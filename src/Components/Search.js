import React, { useContext} from 'react'
import { StateContext } from '../App'

function Search(props) {
    const searchData = useContext(StateContext) 
    
    return (
        <div>
            <input type="text" 
                   onChange={(e)=>{
                        searchData.Dispatch(
                                {type:"Search", payload:e.target.value , FI:0, LI:10}
                            )}
                    }    
                    ref={props.inputRef}                      
                    style={{width: "97%",margin: "2rem 0"}}/>
        </div>
    )
}

export default React.forwardRef((props,ref)=>{
    return <Search inputRef={ref} {...props}/>
})
