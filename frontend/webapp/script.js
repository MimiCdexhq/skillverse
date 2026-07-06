/* ===========================
   SKILLVERSE V1
=========================== */

// Create Moving Stars

const stars = document.getElementById("stars");

for(let i = 0; i < 120; i++){

    const star = document.createElement("div");

    star.style.position = "absolute";

    star.style.width = Math.random()*3 + "px";

    star.style.height = star.style.width;

    star.style.background = "white";

    star.style.borderRadius = "50%";

    star.style.left = Math.random()*100 + "%";

    star.style.top = Math.random()*100 + "%";

    star.style.opacity = Math.random();

    star.style.animation = `twinkle ${2 + Math.random()*4}s infinite`;

    stars.appendChild(star);

}

// Add Animation

const style = document.createElement("style");

style.innerHTML = `

@keyframes twinkle{

0%{opacity:.2;transform:scale(1);}

50%{opacity:1;transform:scale(1.5);}

100%{opacity:.2;transform:scale(1);}

}

`;

document.head.appendChild(style);

// Splash Screen

setTimeout(()=>{

const splash = document.getElementById("splash");

splash.style.transition="1s";

splash.style.opacity="0";

setTimeout(()=>{

splash.style.display="none";

},1000);

},2500);

// Button

const enter = document.querySelector(".enter");

enter.addEventListener("click",()=>{

document.getElementById("main").style.display="none";

document.getElementById("dashboard").style.display="block";

});

const playButton=document.querySelector(".play-now");

playButton.onclick=()=>{

document.getElementById("dashboard").style.display="none";

document.getElementById("playScreen").style.display="block";

}