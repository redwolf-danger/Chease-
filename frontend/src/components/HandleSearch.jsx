import { useState, useEffect } from "react";

function HandleSearch({FormData,setFormData}) {
   


    
    // will be updated by onSearch function





    

    useEffect(() => {
        setSearching(true);
        const handler = setTimeout(() => {
            setDebouncedQuery(FormData.handle);  
        }, 300);  // Delay of 500ms

        return () => clearTimeout(handler); 
    }, [FormData.handle]);

    useEffect(() => {
        if (debouncedQuery) {
            // query is not empty
            const res = await onSearch(debouncedQuery);  // Call API when debouncedQuery updates
            setUnique(res);
        }
        else{
            //query is empty 
            setEmpty(true);
        }
    }, [debouncedQuery, onSearch]);



    <div className="form-control">
              <label className="label">
                {/* //todo what to do when typed */}
                <span className="label-text font-medium">Handle {typed && !empty} </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* <Mail className="size-5 text-base-content/40" /> */}
                  {/* //todo: add an icon here if time  */}
                </div>
                <input
                  type="handle"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter a unique handle"
                  value={FormData.handle}
                //   onChange={(e) => setFormData({ ...FormData, Email: e.target.value })}
                onChange={(e) => {
                    setFormData({...FormData,handle: e.target.value})
                    setTyped(true);
                    setSearching(true);
                    if(e.target.value == ""){
                        setEmpty(true);
                    }
                    else{
                        setEmpty(false);
                    }
               }}
                />
              </div>
            </div>
//     return (
//         <input
//             type="text"
//             placeholder="Enter a Unique Handle"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//         />
//     );
// }




export default HandleSearch;
