import React from "react"; 

export default function Landing({ onSelectRole }) 
{ 
  return ( 
    <div className="gradient-bg"> 
      <div className="landing-container"> 
        
        <div className="landing-title"> 
          Interactive Quiz Management Platform 
        </div> 

        <div className="landing-description"> 
          A structured and user-friendly quiz system built for both learners and creators. 
          Attempt predefined domain-based quizzes or explore user-created question sets. 
          Creators can build, edit, and manage quizzes with customizable difficulty levels, 
          while attempters can track performance, analyze accuracy, and monitor progress 
          across different difficulty categories. 
        </div> 

        <div className="landing-buttons"> 
          <button 
            className="landing-btn-primary" 
            onClick={() => onSelectRole("attempter")} 
          > 
            Start Attempting Quizzes 
          </button> 

          <button 
            className="landing-btn-secondary" 
            onClick={() => onSelectRole("creator")} 
          > 
            Create & Manage Quizzes 
          </button> 
        </div> 

      </div> 
    </div> 
  ); 
}
