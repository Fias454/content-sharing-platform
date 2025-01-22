import React, {useEffect, useState} from "react"; 
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"; 

const root = document.getElementById("root");
//
async function NestPoster(setContentValue){
  const call = await fetch("http://localhost:5000/NestPost",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    credentials:"include"
  });
  const resp = await call.json();
  if(resp.success){
    setContentValue([resp.data]);
  }else{
    console.error(404);
  }
}
async function NestPosterUser(setUser){
  const call = await fetch("http://localhost:5000/NestPostUserPoster", {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    credentials: "include"
  });
  const resp = await call.json();
  if(resp.success){
    console.log(resp.data);
    setUser([resp.data]);
  }else{
    console.log("Here");
    setUser("");
  }
}
function Poster(){
  const [contentValue, setContentValue] = useState([]);
  const [poster, setPoster] = useState([]);
  useEffect(()=>{
    NestPoster(setContentValue);
    NestPosterUser(setPoster)
  },[]);
  return(
    <>
    <section className="basis-3/4 ml-[25%] bg-slate-700 overflow-y-hidden">
    {contentValue.map((item,index)=>(
      <div className="select-none h-[100dvh] w-full flex flex-nowrap">
        <div className="basis-2/3">
        <img className="w-full h-72  border-black border-2  object-fill" src={`http://localhost:5000/PostImg/${item.subPic}`}></img>
        <p className="text-2xl w-1/2 text-white">{item.titleValue}</p>
        <p className="text-2xl w-2/3 text-white">{item.disValue}</p>
        </div>
        <div className="basis-1/3">
        {poster.map((item,index)=>(
          <p className="text-2xl p-1 text-white" key={index}>By: {item}</p>
        ))}
        </div>
      </div>
    ))}
    </section>
    </>
  )
}
function Post(){
  return(
    <>
    <MainHeader/>
       <main className="w-full pt-20 h-[100dvh] flex flex-nowrap">
        <SideBar/>
        <Poster/>
       </main>
    </>
  )
}
//
async function SubmitPost(title, dis,img, setTitle, setDis,setImg, setSubmitButtonBgColor){
  if(title && dis &&img){
    if(title.length && dis.length >5){
      const FD = new FormData();
      FD.append("img", img);
      FD.append("title", title);
      FD.append("dis", dis);
    const call = await fetch("http://localhost:5000/Submit", {
      method:"POST",
      body: FD,
      credentials: "include"
    });
    const resp = await call.json();
    if(resp.success){
      setSubmitButtonBgColor("bg-green-500");
      setTimeout(()=>{
        setSubmitButtonBgColor("bg-white");
      },3000);
      setTitle("");
      setDis("");
      setImg("");
    }else{
        setSubmitButtonBgColor("bg-red-500");
        setTimeout(()=>{
          setSubmitButtonBgColor("bg-white");
        },3000);
      }
    }
  }else{
    setSubmitButtonBgColor("bg-red-500");
    setTimeout(()=>{
      setSubmitButtonBgColor("bg-white");
    },3000);
  }
}
function TitleInput(setTitleValue,setTitleLimit, e){
  const limitValue = e.target.value;
  if(limitValue.length <=250){
    setTitleValue(e.target.value);
    setTitleLimit(250 - limitValue.length);
  }
}
//<input value={title} onChange={(e)=>TitleInput(setTitle, titleLimit,setTitleLimit, e)} maxLength={250} placeholder="Title..." className="bg-slate-900 text-white shadow-sm shadow-slate-800 outline-none ml-[1%] w-[97%] mt-[1%] pl-2 h-full rounded-md"></input>
//<textarea value={dis} onChange={(e)=>setDis(e.target.value)} maxLength={500} placeholder="Discription..." className="h-[100%] resize-none ml-[2%] mt-5 w-[96%] text-black"></textarea>
//<button onClick={()=>SubmitPost(title, dis,setTitle, setDis)} className="block float-right w-1/2 mt-5 text-white bg-black">Post</button>
function disInput(setDisValue, setDisLimit, e){
  const dis = e.target.value;
  if(dis.length <= 500){
    setDisValue(dis);
    setDisLimit(500- dis.length);
  }
}
function PostPage(){
  const [title, setTitle] = useState("");
  const [dis, setDis] = useState("");
  const [img, setImg] = useState("");
  const [titleLimit, setTitleLimit] = useState(250);
  const [disLimit, setDisLimit] = useState(500);
  const [submitBtnBgColor, setSubmitBtnBgColor] = useState("bg-white");
  return(
    <>
     <main className="w-1/2 h-[90dvh] mt-[2.5%] ml-[25%] bg-gradient-to-bl from-black to-slate-800">
      <div className="h-20">
        <p className="text-3xl pt-2 mt-4 ml-2 text-stone-400">New Post</p>
      </div>
      <div className="w-full h-14">
        <div className="bg-slate-900 shadow-sm shadow-slate-800 ml-[1%] w-[97%] mt-[1%] pl-2 h-full rounded-md">
          <input value={title} onChange={(e)=>TitleInput(setTitle,setTitleLimit, e)} maxLength={250} placeholder="Title..." className="inline bg-slate-900 text-white shadow-sm outline-none w-[90%] h-full"></input>
          <p className="w-fit inline text-md text-white ml-1">{titleLimit}</p>
        </div>
      </div>
      <div className="h-20 w-full">
        <label htmlFor="imgUpload" className="w-1/2 block h-[100%] m-2 rounded-md text-xl hover:bg-black transition-all hover:text-white">Img</label>
        <input onChange={(e)=>setImg(e.target.files[0])} id="imgUpload" className="hidden" type="file"></input>
      </div>
      <div className="w-full h-52">
        <div className="h-72 bg-slate-800 shadow-slate-800 mt-5 ml-[1%] w-[97%]">
        <textarea value={dis} onChange={(e)=>disInput(setDis, setDisLimit, e)} maxLength={500} placeholder="Discription..." className="h-[80%] resize-none w-full text-white bg-inherit p-1 outline-none"></textarea>
        <p className="w-fit inline text-md text-white ml-1 float-right text-xl pb-2 pr-2">{disLimit}</p>
      </div>
      </div>
      <div className="block w-full h-20 mt-32">
        <button onClick={()=>SubmitPost(title, dis,img, setTitle, setDis,setImg,setSubmitBtnBgColor)} className={`float-right ${submitBtnBgColor} w-1/4 p-2 mr-2 rounded-md text-xl hover:bg-black transition-all hover:text-white`}>Post</button>
      </div>
     </main>
    </>
  )
}
//
async function LogInSubmit(name,userName,password, setName,setUserName,setPassWord){
  if(name && userName && password){
    const call = await fetch("http://localhost:5000/LogIn", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({name, userName, password}),
      credentials: "include"
    });
    const resp = await call.json();
    if(resp.success){
      setName("");
      setUserName("");
      setPassWord("");
    }
  }
}
async function SignUpSubmit(name,userName,password, setName,setUserName,setPassword){
  if(name && userName && password){
    const call = await fetch("http://localhost:5000/SignUp", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({name, userName, password})
    });
    const resp = await call.json();
    if(resp.success){
      console.log("Signed up success");
      setName("");
      setUserName("");
      setPassword("");
    }
  }}
function SignUp(){
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("block")
  return(
    <>
    <main className={`${state} h-fit mt-[2.5%] ml-[1%] rounded-md bg-gradient-to-l from-slate-950 to-slate-900 w-1/2`}>
        <p className="text-4xl text-center text-white">Ready to log in?</p>
        <div className="h-96">
          <input value={name} onChange={(e)=>setName(e.target.value)} className="w-[70%] h-1/5 mt-2 ml-[15%] text-2xl" placeholder="enter name..."></input>
          <input value={userName} onChange={(e)=>setUserName(e.target.value)} className="w-[70%] h-1/5 mt-2 ml-[15%] text-2xl" placeholder="enter user name..."></input>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} className="w-[70%] h-1/5 mt-2 ml-[15%] text-2xl" placeholder="enter password"></input>
          <button  onClick={()=>SignUpSubmit(name, userName,password, setName,setUserName, setPassword)} className="block w-1/2 ml-[25%] mt-2 bg-black text-white border-2 border-white">Submit</button>
        </div>
      </main>
    </>
  )
}
/*function AccountStateChange(logInState, signUpState, setLogInState, setSignUpState){
  if(logInState ==="block" || signUpState ==="hidden"){
    setLogInState("hidden");
    setSignUpState("block");
  }else{
    setLogInState("block");
    setSignUpState("hidden");
  }
}*/
function LogIn(){
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("block")
  return(
    <>
      <main className={`${state} h-fit mt-[2.5%] ml-[1%] rounded-md bg-gradient-to-l from-slate-950 to-slate-900 w-1/2`}>
        <p className="text-4xl text-center text-white">Ready to log in?</p>
        <div className="h-96">
          <input value={name} onChange={(e)=>setName(e.target.value)} className="w-[70%] h-1/5 mt-2 ml-[15%] text-2xl" placeholder="enter name..."></input>
          <input value={userName} onChange={(e)=>setUserName(e.target.value)} className="w-[70%] h-1/5 mt-2 ml-[15%] text-2xl" placeholder="enter user name..."></input>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} className="w-[70%] h-1/5 mt-2 ml-[15%] text-2xl" placeholder="enter password"></input>
          <button onClick={()=>LogInSubmit(name, userName,password, setName,setUserName, setPassword)} className="block w-1/2 ml-[25%] mt-2 bg-black text-white border-2 border-white">Submit</button>
        </div>
      </main>
    </>
  )
}
function AccountPage(){
  return(
    <>
    <LogIn/>
    <SignUp/>
    </>
  )
}
//
function LogoHeader(){
  return(
    <>
    <span className="h-full basis-1/5">

    </span>
    </>
  )
}
function SearchBar(){
  return(
    <>
    <span className="h-full basis-2/5">
      <input className="h-[70%] w-2/3 mt-[1.5%] "></input>
    </span>
    </>
  )
}
function AccountHeader(){
  const navigate = useNavigate();
  return(
    <>
     <span className="basis-1/5 f-full">
      <button onClick={()=>{navigate("/Account")}} className="float-right w-1/2 h-full text-3xl text-white hover:text-slate-500"><i class="fa fa-user" aria-hidden="true"></i></button>
     </span>
    </>
  )
}
function Userheader(){
  return(
    <>
    <span className="h-full border-l-2 basis-1/5 border-slate-800">
      <img className="w-1/3 h-[90%] mt-[1.5%] float-right" alt="userImg"></img>
    </span>
    </>
  )
}
//
//
function MainHeader(){
  return(
    <>
     <header className="fixed flex w-full h-20 border-b-2 border-slate-600 bg-slate-900 flex-nowrap ">
     <LogoHeader/>
     <SearchBar/>
     <AccountHeader/>
     <Userheader/>
     </header>
    </>
  )
}
function PostHeader(){
  const navigate = useNavigate();
  return(
    <>
     <div className="w-full h-12">
      <button onClick={()=>navigate("/Post")} className="h-[90%] hover:bg-white hover:text-black text-white transition-all rounded-md w-[90%] ml-[5%] text-2xl text mt-[1.5%] text-center"><i className="fa fa-plus"></i>Post</button>
     </div>
    </>
  )
}
function SideBar(){
  return(
    <>
     <section className="fixed w-1/4 h-full border-r-2 border-slate-600 bg-slate-900">
      <PostHeader/>
      <div className="h-28">
        <button className="w-full pl-1 text-xl text-left h-1/4 text-slate-400 hover:bg-slate-500">My feed</button>
        <button className="w-full pl-1 text-xl text-left h-1/4 text-slate-400 hover:bg-slate-500">Following</button>
        <button className="w-full pl-1 text-xl text-left h-1/4 text-slate-400 hover:bg-slate-500">Explore</button>
      </div>
     </section>
    </>
  )
}
async function setNest(titleValue, navigate){
  if(titleValue){
    const call = await fetch("http://localhost:5000/setNest", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({titleValue}),
      credentials: "include"
    });
    const resp = await call.json();
    if(resp.success){
      navigate("/PostPage");
    }
  }
}
async function NestFeed(setFeedContent){
  const call = await fetch("http://localhost:5000/Nest", {
    method:"GET",
    headers:{
      "Content-Type":"application/json"
    }
  });
  const resp = await call.json();
  setFeedContent(resp);
}
function FeedMain(){
  const navigate = useNavigate();
  const [feedContent, setFeedContent] = useState([]);
  useEffect(()=>{
    NestFeed(setFeedContent);
  }
  , [])
  return(
    <div className="grid w-[90%] ml-[5%] grid-cols-3 gap-2 h-fit">
      {feedContent.map((item,index)=>(
      <span onClick={()=>setNest(item.titleValue, navigate)} key={index} className="mt-2 p-2 hover:bg-slate-900 transition-all bg-slate-800 h-72 rounded-md col-1">
        <img className="w-full h-[50%] object-cover w-full" src={`http://localhost:5000/PostImg/${item.subPic}`}></img>
        <p className="text-center text-2xl text-white pt-[5%]">{item.titleValue}</p>
      </span>
      ))}
    </div>
  )
}
function MainContent(){
  return(
    <>
     <section className="basis-3/4 ml-[25%] bg-slate-700">
      <FeedMain/>
     </section>
    </>
  )
}
function MainPage(){
     return(
      <>
       <MainHeader/>
       <main className="w-full pt-20 h-[100dvh] flex flex-nowrap">
        <SideBar/>
        <MainContent/>
       </main>
      </>
     )
}
//
function IntroPageHeader() {
  return (
    <header className="w-full pt-20 CHeader h-fit">
      <p className="text-4xl text-center select-none text-slate-700 ">Welcome to site where you can post adn comment on posts</p>
    </header>
  );
}
function DisBox(){
  const navigate = useNavigate();
  return(
    <>
    <section className="w-full xl:w-[90%]  xl:pl-[10%] grid mt-[5%] grid-cols-3 gap-3">
      <div className="col-span-3 transition-all rounded-md h-72 md:col-auto hover:bg-slate-900 bg-slate-950">
        <p className="pt-2 text-2xl text-center text-stone-100">lorem lorem lorem</p>
      </div>
      <div className="col-span-3 transition-all rounded-md h-72 md:col-auto hover:bg-slate-900 bg-slate-950">
        <p className="pt-2 text-2xl text-center text-stone-100">lorem lorem lorem</p>
      </div>
      <div className="col-span-3 transition-all rounded-md h-72 md:col-auto hover:bg-slate-900 bg-slate-950">
        <p className="pt-2 text-2xl text-center text-stone-100">lorem lorem lorem</p>
      </div>
    </section>
    <button onClick={()=>{navigate("/Main")}} className="select-none text-white ml-[42.5%] mt-5 p-2 w-[15%] rounded-3xl text-xl bg-black hover:bg-white hover:text-black transition-all border-white border-2 ">Start posting</button>
    </>
  )
}
function IntorPage() {
  return (
    <div>
      <IntroPageHeader />
      <DisBox />
    </div>
  );
}
//
function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntorPage />} />
        <Route path="/Main" element={<MainPage/>}/>
        <Route path="/Account" element={<AccountPage/>}/>
        <Route path="/Post" element={<PostPage/>} />
        <Route path="/PostPage" element={<Post/>} />
      </Routes>
    </BrowserRouter>
  );
}

const main = ReactDOM.createRoot(root);
main.render(<Main />);
