(()=>{"use strict";class t{constructor(t){this.tileElement=t,this.letterElement=this.tileElement.querySelector("p")}setTileLetter(t){this.letterElement.textContent=t,this.tileElement.dataset.letter=t}getTileLetter(){return this.tileElement.dataset.letter}setTileState(t){this.tileElement.dataset.state=t}clearTile(){this.tileElement.dataset.letter="",this.tileElement.dataset.state="tbd",this.letterElement.textContent=""}}class e{constructor(t,e,s){this.width=t,this.height=e,this.tiles=[],this.initGameBoard(s)}initGameBoard(e){for(let s=0;s<this.height;s++)for(let a=0;a<this.width;a++){const r=new t(e[s*this.width+a]);this.tiles.push(r)}}getTile(t,e){return this.tiles[t*this.width+e]}getTileFromIndex(t){return this.tiles[t]}getRowWord(t){let e="";for(let s=0;s<this.width;s++)e+=this.getTile(t,s).getTileLetter();return e}clearGameBoard(){this.tiles.forEach((t=>{t.clearTile()}))}}class s{constructor(t,e,s,a,r){this.gameBoard=t,this.stateController=e,this.wordsController=s,this.gameKeyboard=a,this.activeRow=0,this.activeTile=0,this.timerTime=r}initGameController(){0!==this.stateController.getStateLetters().length&&this.readGameFromSavedState(),this.checkTimer()}readGameFromSavedState(){const t=this.stateController.getStateLetters(),e=this.stateController.getTileStates();for(let s=0;s<t.length;s++){const a=t[s],r=e[s],i=this.gameBoard.getTileFromIndex(s);i.setTileLetter(a),i.setTileState(r),this.gameKeyboard.setKeyState(a,r)}this.activeRow=Math.floor(t.length/this.gameBoard.width)}pauseGame(){this.stateController.setStatus("pause")}resumeGame(){this.stateController.setStatus("play")}showToast(t){const e=document.querySelector(".board-container"),s=document.querySelector(".toast"),a=document.createElement("div");s&&s.remove(),a.classList.add("toast"),a.innerHTML=t,e.appendChild(a),setTimeout((()=>{a.classList.add("show")}),10),setTimeout((()=>{a.classList.remove("show"),setTimeout((()=>{a.remove()}),500)}),3e3)}enterLetter(t){if(this.activeTile<this.gameBoard.width&&"play"===this.stateController.getStatus()){const e=this.gameBoard.getTile(this.activeRow,this.activeTile),s=e.tileElement;s.classList.add("enter"),s.addEventListener("animationend",(()=>{s.classList.remove("enter")}),{once:!0}),e.setTileLetter(t),e.setTileState("none"),this.activeTile++}}deleteLetter(){if(0!=this.activeTile&&"play"===this.stateController.getStatus()){const t=this.gameBoard.getTile(this.activeRow,this.activeTile-1);t.setTileLetter(""),t.setTileState("tbd"),this.activeTile--}}enterWord(){if(this.activeTile!==this.gameBoard.width||"play"!==this.stateController.getStatus())return;let t=this.gameBoard.getRowWord(this.activeRow);this.wordsController.checkWordIsCorrect(t)?this.setTileStates(t):this.showToast(`&#128528; <strong>${t}</strong> so'zi lug'atimizda yo'q!`)}setTileStates(t){this.pauseGame();for(let e=0;e<t.length;e++){const s=this.gameBoard.getTile(this.activeRow,e),a=s.tileElement,r=this.stateController.getDecodedGuess(),i=t[e];let o="none";o=i===r[e]?"correct":r.includes(i)&&(1===this.wordsController.getCharacterSizeInWord(t,i)||2===this.wordsController.getCharacterSizeInWord(t,i)&&2===this.wordsController.getCharacterSizeInWord(r,i)||2===this.wordsController.getCharacterSizeInWord(t,i)&&t.indexOf(i)!==e&&r[t.indexOf(i)]!==i)?"include":"incorrect",setTimeout((()=>{a.classList.add("check")}),100*e),a.addEventListener("transitionend",(()=>{a.classList.remove("check"),s.setTileState(o),this.gameKeyboard.setKeyState(i,o),this.stateController.setStateLetters(i),this.stateController.setTileStates(o),a.addEventListener("transitionend",(()=>{4===e&&this.checkWinLose(t)}),{once:!0})}),{once:!0})}}checkWinLose(t){t===this.stateController.getDecodedGuess()?this.setWinLose("win"):this.activeRow===this.gameBoard.height-1?this.setWinLose("lose"):(this.activeRow++,this.activeTile=0,this.resumeGame())}setWinLose(t){let e=0;this.stateController.setStatus(t),this.stateController.setPlaysCount(),"win"===t?(e=2200,this.stateController.setAttempts(this.activeRow),this.stateController.setWinsCount(),this.stateController.setCurrentStreak(this.stateController.getCurrentStreak()+1),this.stateController.setMaxStreak(),this.stateController.getDecodedGuess().split("").forEach(((t,e)=>{const s=this.gameBoard.getTile(this.activeRow,e).letterElement;setTimeout((()=>{s.classList.add("win")}),100*e+500),s.addEventListener("animationend",(()=>{s.classList.remove("win")}),{once:!0})}))):(e=750,this.stateController.setCurrentStreak(0)),setTimeout((()=>{this.stateController.setLastPlayedTime((new Date).getTime()),this.checkTimer()}),e)}clearGame(){this.activeRow=0,this.activeTile=0,this.gameBoard.clearGameBoard(),this.gameKeyboard.clearKeyState(),this.stateController.clearState()}startCountDown(){const t=(new Date).getTime()-this.stateController.getLastPlayedTime();let e=this.timerTime-t;this.writeTimerTime(this.getTimeString(e)),this.showWinModal();const s=setInterval((()=>{e-=1e3,Math.floor(e/1e3)>=1?this.writeTimerTime(this.getTimeString(e)):(this.clearGame(),this.resumeGame(),this.clearModal(),clearInterval(s))}),1e3)}checkTimer(){const t=(new Date).getTime()-this.stateController.getLastPlayedTime(),e=this.stateController.getStatus();Math.floor((this.timerTime-t)/1e3)>1?this.startCountDown():"win"!==e&&"lose"!==e||this.clearGame()}getTimeString(t){let e=Math.floor(t%36e5/6e4),s=Math.floor(t%6e4/1e3);return`${e<10?"0"+e:e}:${s<10?"0"+s:s}`}setStatsToModal(){const t=document.querySelector(".plays").querySelectorAll(".value"),e=document.querySelector(".attempts").querySelectorAll(".bar"),s=this.stateController.getPlaysCount(),a=this.stateController.getWinsCount();t[0].textContent=s,t[1].textContent=0===s?"0%":Math.round(a/s*100)+"%",t[2].textContent=this.stateController.getCurrentStreak(),t[3].textContent=this.stateController.getMaxStreak(),this.stateController.getAttempts().forEach(((t,s)=>{if(0!==t){const r=e[s],i=t/a*150+25;r.dataset.number=t,r.textContent=t,r.style.height=i+"px"}}))}showWinModal(){this.setStatsToModal();const t=document.querySelector("[data-area='stats-modal']"),e=t.querySelector(".modal__dialog"),s=e.querySelector(".modal__header"),a=e.querySelector(".modal__word"),r=t.querySelector(".modal__close"),i=e.querySelector(".modal__timer");let o="";a.innerHTML="","win"===this.stateController.getStatus()?(s.innerHTML="<strong>🎉 Tabriklaymiz dastur o'ylagan<br>so'zni topdingiz!</strong>",o="correct"):"lose"==this.stateController.getStatus()&&(s.innerHTML="<strong>😐 Afsus dastur o'ylagan so'zni<br>topolmadingiz!</strong>"),this.stateController.getDecodedGuess().split("").forEach((t=>{a.innerHTML+=`<p class="${o}">${t}</p>`})),i.style.display="block",t.dataset.hidden="false",e.classList.add("slide-in"),e.addEventListener("animationend",(()=>{e.classList.remove("slide-in")}),{once:!0}),r.addEventListener("click",(()=>{t.dataset.hidden="true"})),t.addEventListener("click",(e=>{e.target.matches("[data-area]")&&(t.dataset.hidden="true")}))}writeTimerTime(t){document.querySelector(".timer-time").textContent=t}clearModal(){const t=document.querySelector("[data-area='stats-modal']"),e=t.querySelector(".modal__dialog"),s=e.querySelector(".modal__header"),a=e.querySelector(".modal__word"),r=e.querySelector(".modal__timer"),i=r.querySelector(".timer-time");e.classList.remove("slide-in"),t.dataset.hidden="true",i.textContent="00:00",r.style.display="none",s.innerHTML="",a.innerHTML=""}}class a{constructor(t){this.keyboardKeys=[...t]}setKeyState(t,e){let s=this.getKey(t);"correct"!==this.getKeyState(t)&&(s.dataset.state=e)}getKeyState(t){return this.getKey(t).dataset.state}getKey(t){return this.keyboardKeys.find((e=>e.dataset.key===t))}clearKeyState(){this.keyboardKeys.forEach((t=>{t.dataset.state="tbd"}))}}class r{constructor(t){this.wordsList=t}getEncodedWord(t){return window.btoa(t)}getDecodedWord(t){return window.atob(t)}getRandomWord(){return this.getEncodedWord(this.wordsList[Math.floor(Math.random()*this.wordsList.length)])}checkWordIsCorrect(t){return this.wordsList.includes(t.toLowerCase())}getCharacterSizeInWord(t,e){let s=0;for(let a=0;a<t.length;a++)t[a]===e&&(s+=1);return s}}const i={letters:[],states:[],guess:"",status:"play",lastPlayedTime:0},o={playsCount:0,winsCount:0,attempts:[0,0,0,0,0,0],currentStreak:0,maxStreak:0};class l{constructor(t){this.gameState=JSON.parse(JSON.stringify(i)),this.gameStats=JSON.parse(JSON.stringify(o)),this.wordsController=t,this.initStateController()}initStateController(){const t=this.readStateFromLocalStorage(),e=this.readStatsFromLocalStorage();t?(this.setGameState(t),this.setGameStats(e),""===this.getGuess()&&this.setGuess(this.wordsController.getRandomWord())):(this.setGuess(this.wordsController.getRandomWord()),this.saveStatsToLocalStorage(this.gameStats))}setGameState(t){this.gameState=JSON.parse(JSON.stringify(t)),this.saveStateToLocalStorage(this.gameState)}setStateLetters(t){this.gameState.letters.push(t),this.saveStateToLocalStorage(this.gameState)}getStateLetters(){return this.gameState.letters}setTileStates(t){this.gameState.states.push(t),this.saveStateToLocalStorage(this.gameState)}getTileStates(){return this.gameState.states}setGuess(t){this.gameState.guess=t,this.saveStateToLocalStorage(this.gameState)}getGuess(){return this.gameState.guess}getDecodedGuess(){return this.wordsController.getDecodedWord(this.getGuess())}setStatus(t){this.gameState.status=t,this.saveStateToLocalStorage(this.gameState)}getStatus(){return this.gameState.status}setLastPlayedTime(t){this.gameState.lastPlayedTime=t,this.saveStateToLocalStorage(this.gameState)}getLastPlayedTime(){return this.gameState.lastPlayedTime}saveStateToLocalStorage(t){localStorage.setItem("gameState",JSON.stringify(t))}readStateFromLocalStorage(){return JSON.parse(localStorage.getItem("gameState"))}clearState(){this.setGameState(i),this.initStateController()}setGameStats(t){this.gameStats=JSON.parse(JSON.stringify(t)),this.saveStatsToLocalStorage(this.gameStats)}setPlaysCount(){this.gameStats.playsCount++,this.saveStatsToLocalStorage(this.gameStats)}getPlaysCount(){return this.gameStats.playsCount}setWinsCount(){this.gameStats.winsCount++,this.saveStatsToLocalStorage(this.gameStats)}getWinsCount(){return this.gameStats.winsCount}setAttempts(t){this.gameStats.attempts[t]++,this.saveStatsToLocalStorage(this.gameStats)}getAttempts(){return this.gameStats.attempts}setCurrentStreak(t){this.gameStats.currentStreak=t,this.saveStatsToLocalStorage(this.gameStats)}getCurrentStreak(){return this.gameStats.currentStreak}setMaxStreak(){this.gameStats.maxStreak=Math.max(this.gameStats.maxStreak,this.gameStats.currentStreak),this.saveStatsToLocalStorage(this.gameStats)}getMaxStreak(){return this.gameStats.maxStreak}saveStatsToLocalStorage(t){localStorage.setItem("gameStats",JSON.stringify(t))}readStatsFromLocalStorage(){return JSON.parse(localStorage.getItem("gameStats"))}clearStats(){this.setStats(o)}}function n(){let t="dark"===window.localStorage.getItem("theme")?"light":"dark";document.documentElement.dataset.theme=t,window.localStorage.setItem("theme",t)}function h(t,e){const s=document.querySelector(`[data-area='${t}']`),a=s.querySelector(".modal__dialog"),r=s.querySelector(".modal__close");e.setStatsToModal(),s.dataset.hidden="false",a.classList.add("slide-in"),a.addEventListener("animationend",(()=>{a.classList.remove("slide-in")}),{once:!0}),r.addEventListener("click",(()=>{s.dataset.hidden="true"})),s.addEventListener("click",(t=>{t.target.matches("[data-area]")&&(s.dataset.hidden="true")}))}!async function(){const t=await fetch("https://mirzobedil.uz/games/toptop/data/wordsList.json");!function(t){const i=document.querySelector(".theme-toggle"),o=document.querySelector(".help-btn"),d=document.querySelector(".stats-btn"),c=document.querySelectorAll(".tile"),m=document.querySelectorAll("[data-key]"),S=document.querySelector("[data-enter]"),g=document.querySelector("[data-delete]"),u=new a(m),T=new r(t),y=new l(T),C=new e(5,6,c),L=new s(C,y,T,u,6e4);L.initGameController(),i.addEventListener("click",n),document.addEventListener("click",(t=>{t.target.matches("[data-key]")&&L.enterLetter(t.target.dataset.key)})),S.addEventListener("click",(()=>{L.enterWord()})),g.addEventListener("click",(()=>{L.deleteLetter()})),o.addEventListener("click",(()=>{h(o.dataset.open,L)})),d.addEventListener("click",(()=>{h(d.dataset.open,L)}))}((await t.json()).words)}()})();