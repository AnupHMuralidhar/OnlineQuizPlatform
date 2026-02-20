import React from "react"; 
export default function Landing({ onSelectRole }) 
{ return ( <div className="gradient-bg"> 
<div className="landing-container"> <div className="landing-title"> Smart Quiz Platform </div> 
<div className="landing-description"> A powerful and flexible quiz management system designed for both learners and creators. Attempt domain-based quizzes, build your own question sets, track performance, 
  and enhance your knowledge through an interactive and structured experience. </div> 
<div className="landing-buttons"> <button className="landing-btn-primary" onClick={() => onSelectRole("attempter")} > Start Attempting Quizzes 
</button> <button className="landing-btn-secondary" onClick={() => onSelectRole("creator")} > Create & Manage Quizzes </button> </div> </div> </div> ); }