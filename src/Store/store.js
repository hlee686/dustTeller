import {configureStore, createSlice} from "@reduxjs/toolkit"

export let myName = createSlice({
    name: "myName",
    initialState: [],
    reducers: {
        addList(state, action){
            state.push(action.payload)
        }
    }
})

export let {addList} = myName.actions

export default configureStore({
    reducer:{
        myName: myName.reducer
    }
})