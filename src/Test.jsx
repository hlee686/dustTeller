import React from "react"
import axios from "axios"
import {useRef, useState, useEffect} from "react"
import {useSelector, useDispatch} from "react-redux"
import {addList} from "./Store/store"
import styled from "styled-components"
import { listenerCount } from "process"
import {myName, box} from "./Store/store"
import {boxChecked} from "./Store/store"


function Test(){

    let myName = useSelector(state => state.myName.posts)
    let dispatch = useDispatch()

    let myBox = useSelector(state => state.myBox)

    const Div = styled.div`
    width: 250px;
    height: 250px;
    background: ${props => props.bgColor};
    border-radius: 15px;`
    
    let [value, setValue] = useState('')
    let [pmValue, setPm10Value] = useState('')
    let [bgColor, setBgColor] = useState("")
    let [weatherState, setWeatherState] = useState('')
    let [locationList, setLocationList] = useState([])
    let [val, setVal] = useState('')
    let [result, setResult] = useState("")
    let [toggle, setToggle] = useState(null)
    let [list, setList] = useState([])
    let [selectedStation, setSelectedStation] = useState(null);
    let [grade, setGrade] = useState('')

    const selectRef = useRef(null)

    let [checked, setChecked] = useState(false)

    let [newCardList, setNewCardList] = useState([])


    useEffect(()=>{
        showData()
    }, [])

    function getData() {
        return axios.get("https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6dd85928-7919-46c7-ab66-0931df3fe4aa/data.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230324T041014Z&X-Amz-Expires=86400&X-Amz-Signature=cac34d559e5a1fcd6c2d240007c9c50df1819a55b1917b805f575f34328091fe&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22data.json%22&x-id=GetObject")
            .then(response => response.data)
    }

    const showData = async() => {
        await setLocationList(await getData().then(data => data.response.body.items))
        return getData().then(data => data.response.body.items)
    }

    async function getItems() {
        const data = await getData();
        return data.response.body.items;
      }
    async function logItems() {
        const items = await getItems();
        setList(items)
      }

    useEffect(()=>{logItems()},[])

    const searchArea = (e) =>{
        value = e.target.value
        setValue(value)
    }


    const showArea = (value) =>{
        searchNoth(value)
        showData()
        .then(array => array.filter(item => item.stationName === value))
        .then(filtered => {
            if (filtered.length > 0) {
                setPm10Value(filtered[0]["pm10Value"]);
                setResult("YES RESULT")
            } else {
                setResult("NO RESULT")
            }
        })
    }

    useEffect(()=>{
        if(pmValue > 12){
            setBgColor("skyblue")
        }else{
            setBgColor("yellow")
        }
    },[pmValue])

    useEffect(()=>{
        if(pmValue > 12){
            setWeatherState("나쁨")
        }else{
            setWeatherState("좋음")
        }
    }, [pmValue])

    let searchArray = locationList
    .filter(item => item.stationName !== undefined)
    .map(item => item.stationName)

    const searchNoth = (value) =>{
        if(searchArray.includes(value)){
            setVal(true)
        }else{
            setVal(false)
        }
    }

    const date = new Date()

    const handleStationChange = (event) => {
        setSelectedStation(event.target.value)
        showArea(selectedStation)
      }

    const allAtOnce = () => {
        setToggle("Once")
    }

    /*function find(item) {
        setNewCardList(newCardList.concat(item))
        setNewCard(item.stationName)
        setPm10Value(item.pm10Value)
        setGrade(pmValue > 15 ? "좋음" : "나쁨")
        
    }*/

    const find = (item) => {
        dispatch(addList(item))
        setChecked(!checked)

 }

    const getParameters = {
        serviceKey: 'KunFbBGHAU8Fq2G2OtVDQ8hkeRi4Oh2HrZJ2rghnN0lWoCU1UpExxCY133vKoNOkUx5QjT8GsD8Q9gq6iaDvMw%3D%3D',
        returnType:'json',
        numOfRows:'100',
        pageNo:'1',
        sidoName: "서울",
        ver:'1.0',
    }
    

    const apiCall = async () => {
        const response = await axios.get("/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty", {params: getParameters}
          )
          console.log(response)
      }

    

    return (
        <div>

            <button onClick={()=>setToggle("Search")}>검색옵션</button>
            <button onClick={()=>setToggle("List")}>리스트옵션</button>

            <button onClick={()=>allAtOnce()}>한번에보기</button>

            {toggle === "Search" ? 
            <div><input type="text" placeholder="지역 검색!" onBlur={searchArea}></input>
            <button onClick={()=>showArea(value)}>검색!</button>
            {result === "NO RESULT" ? <Div><h1>결과 없음</h1></Div> :  <Div bgColor={bgColor}>
                <h1>{value}</h1>
                <p>{value}의 미세먼지 수치는...{pmValue}</p>
                <p>{weatherState}</p>
                <p>({date.getFullYear()}년 {date.getMonth()}월 {date.getDate()}일 {date.getHours()}시 기준)</p>
            </Div>}</div> 
            : <select onChange={handleStationChange}>
            {toggle === "List" ? list.length===0 ? null : list.map(item => <option key={item}>{item.stationName}</option>) : null}
             </select> }
            {toggle === "List" ? <Div bgColor={bgColor}>
                <h1>{selectedStation}</h1>
                <p>{selectedStation}의 미세먼지 수치는...{pmValue}</p>
                <p>{weatherState}</p>
                <p>({date.getFullYear()}년 {date.getMonth()}월 {date.getDate()}일 {date.getHours()}시 기준)</p>
            </Div> : null}

            {toggle === "Once" ? list.map(item => <Div bgColor={item.pm10Value > 15 ? "skyblue" : "yellow"}>
                <h1>{item.statioName}</h1>
                <p>{item.stationName}의 미세먼지 수치는...{item.pm10Value}</p>
                <p>{item.pm10Value > 15 ? "나쁨" : "좋음"}</p>
                <p>({date.getFullYear()}년 {date.getMonth()}월 {date.getDate()}일 {date.getHours()}시 기준)</p>
                
                <label class="switch">
                    <input type="checkbox" onChange={()=>find(item)} checked={checked}/>
                    <span class="slider round"></span>
                </label>

            </Div>): null}


            {myName.map(item => 
            <div style={{position: "relative", top: "-10860px", left: "400px"}}>
            <Div bgColor={item.pm10Value > 15 ? "skyblue" : "yellow"}>
                <h1>{item.stationName}</h1>
                <p>{item.stationName}의 미세먼지 수치는...{item.pm10Value}</p>
                <p>{item.pm10Value > 15 ? "나쁨" : "좋음"}</p>
                <p>({date.getFullYear()}년 {date.getMonth()}월 {date.getDate()}일 {date.getHours()}시 기준)</p>
            </Div>
            </div>)}

        </div>
    )
}

export default Test