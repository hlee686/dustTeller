import {configureStore, createSlice} from "@reduxjs/toolkit"

export let myName = createSlice({
    name: "myName",
    initialState: "Sean Lee"
})

export default configureStore({
    reducer:{
        myName: myName.reducer
    }
})