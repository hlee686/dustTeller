import {configureStore, createSlice} from "@reduxjs/toolkit"

const initialState = {
    posts: [],
    status: "idle",
    erorr : null
}

export let myName = createSlice({
    name: "myName",
    initialState,
    reducers: {
        addList(state, action){
            state.posts.push(action.payload)
        }
    }
})

export let {addList, removeList} = myName.actions

export let box = createSlice({
    name: "checkBox",
    initialState : false,
    reducers: {
        boxChecked(state, action){
            return state + action.payload
        }
    }
})
export let {boxChecked} = box.actions

export default configureStore({
    reducer:{
        myName: myName.reducer,
        myBox: box.reducer
    }
})