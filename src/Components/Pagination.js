import React, { useContext, useEffect } from 'react'
import { StateContext } from '../App'
import Delete from './Delete';

function Pagination() {
    const loadPages= useContext(StateContext);
    const totalPages=[];
    var indexOfLastPage, indexOfFirstPage;

    for(let i=1; i<=loadPages.modState.NoOfPages; i++)
      totalPages.push(i);

      useEffect(()=>{
        let indexOfLastPage = loadPages.modState.CurrentPage * 10;
        let indexOfFirstPage =indexOfLastPage - 10;

        loadPages.Dispatch({type:'onLoad', FI:indexOfFirstPage, LI:indexOfLastPage})
      },[])

    function changePage(pageNo){
        if(pageNo < 1)
            pageNo = 1
        else if(pageNo >loadPages.modState.NoOfPages)
            pageNo = loadPages.modState.NoOfPages  

        indexOfLastPage =  pageNo * 10;
        indexOfFirstPage = indexOfLastPage - 10;

        if(loadPages.modState.Selected.length >0){
          const newArr = loadPages.modState.FilteredData.slice(loadPages.modState.IndexOfFirstPage,loadPages.modState.IndexOfLastPage)
                                                  .map(items => {return {...items, checked:false }}) 
          const arr = [...loadPages.modState.FilteredData]
          
          for(let i= 0; i< 10; i++){
              arr.splice(loadPages.modState.IndexOfFirstPage + i, 1, newArr[i] )  
            }
          
            loadPages.Dispatch({type:"removeCheckOnPageChange", 
                                payload:arr
                              }) 
        }
        
        loadPages.Dispatch({type:"typeChanged", 
                            FI:indexOfFirstPage,
                            LI:indexOfLastPage,
                            CurrentPage:pageNo,
                        })
        
                        
    }

return (
    <div className='pagination'>
      <nav>
        <div className="left">
          <Delete/>
        </div>
        <div className="right">
          <ul className="pagination pagination-lg">
            <li className="page-item" aria-current="page" onClick={()=>changePage(loadPages.modState.FirstPage)}>
              <span className="page-link"><i className="fa-solid fa-angles-left"></i></span>
            </li>
            <li className="page-item" aria-current="page" onClick={()=>changePage(loadPages.modState.CurrentPage -1)}>
              <span className="page-link"><i className="fa-solid fa-angle-left"></i></span>
            </li>
            {totalPages.map(pages=>{
                return  <li className={loadPages.modState.CurrentPage == pages ? "page-item active" : "page-item"} 
                            key={pages} onClick={()=>changePage(pages)}>
                            <span className="page-link">{pages}</span>
                        </li>
            })}

            <li className="page-item" aria-current="page" onClick={()=>changePage(loadPages.modState.CurrentPage +1)}>
                    <span className="page-link"><i className="fa-solid fa-angle-right"></i></span>
            </li>
            <li className="page-item" aria-current="page" onClick={()=>changePage(loadPages.modState.NoOfPages)}>
              <span className="page-link"><i className="fa-solid fa-angles-right"></i></span>
            </li>

          </ul>
        </div>
      </nav>
      
    </div>
  )
}

export default Pagination
