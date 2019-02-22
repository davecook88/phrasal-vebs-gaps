import React from 'react';
import './App.css';

let level = 0;
const paragraph = require("./paragraphs.json");
const oVerbForms = require("./verbForms.json");


function makeArrayFromObj(v) {
  const a = [];
  for (let x in v) {
    for (let y in v[x]) {
        if (a.indexOf(v[x][y]) === -1) a.push(v[x][y])
      }
  }
  return a;
}

const replacedText = makeArrayFromObj(oVerbForms);

class Dropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      left:props.left,
      top:props.top,
      id:null,
      correctVerbSelected:false,
      currentVerb:props.currentVerb,
      clickedSpaceCount:props.clickedSpaceCount,
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.setState(nextProps);
    }
  }

  makeListElement = (v) => {
    let result = [];
    const optionsList = v === "verbs" ? Object.keys(oVerbForms) : makeArrayFromObj([oVerbForms[this.state.currentVerb[this.state.clickedSpaceCount]],]);

    optionsList.forEach((text) => {
      result.push(<li className="li-class" id={text} onClick={this.onClick}>{text}</li>)
    })
    return result;
  }

  onClick = (e) => {
    const optionSelected = e.target.id;
    if (this.state.correctVerbSelected){
      this.props.checkAnswer(optionSelected);
      this.setState({correctVerbSelected:false});
    } else {
      let correctVerb = this.state.currentVerb[this.state.clickedSpaceCount];
      if (optionSelected === correctVerb  ){
        this.setState({correctVerbSelected:true});
      } else {
        this.props.addPoints(-3);
      }
    }

  }



  render() {
    return (
      <div className="Dropdown" style={{
        top:this.state.top,
        left:this.state.left,
      }}>
        <ul className="ul-class">
          {this.state.correctVerbSelected ? this.makeListElement("verbForms") : this.makeListElement("verbs")}
        </ul>

      </div>
    )
  }
}

class PunctuationSpace extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showDropdown:props.showDropdown,
      answered:props.answered,
      content:props.content,
      spaceCount:props.spaceCount,
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.setState(nextProps);
    }
  }

  createClassList = () => {
    return this.state.answered ? "punctuation-space-answered" :"punctuation-space";
  }

  onClick = (e) => {
    this.state.showDropdown(e, this.state.spaceCount);
    this.props.startTimer();
  }

  render() {
    return (
      <span id={this.props.id} className={this.createClassList()} onClick={this.onClick}>{this.state.content}</span>
    );
  }
}

class TextSpace extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      answered:props.answered,
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.setState(nextProps);
    }
  }

  formatText = () => {
    if (this.state.answered){
      return this.props.text;
    }
    return this.props.text;
  }

  render() {
    return (
      <span className="text-span">{this.formatText()}</span>
    );
  }
}

class Timer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      on: props.on,
      seconds:0,
      running:false,
    }
    this.timer = 0;
    this.countDown = this.countDown.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.startTimer();
  }
  componentWillReceiveProps(nextProps){
      if (!nextProps.on) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
      this.setState({on:nextProps.on});
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds + 1;
    this.setState({
      seconds: seconds,
    });

  }

  startTimer() {
    if (this.state.running) return;
    if (this.state.on){
      this.timer = setInterval(this.countDown, 1000);
      this.setState({running:true});
    }
    else {
      this.stopTimer();
    }
  }

  stopTimer() {
    this.setState({
      on:false,
      seconds:0,
      running:false,
    });
    clearInterval(this.timer);
  }

  formatTime = () => {
    let sec = this.state.seconds;
    const seconds = (s) => {
      let str = Math.floor(s % 60).toString();
      if (str.length < 2) str = "0" + str;
      return str;
    }
    const minutes = (s) => {
      let str = Math.floor(s / 60).toString();
      if (str.length < 2) str = "0" + str;
      return str;
    }
    return `${minutes(sec)}:${seconds(sec)}`
  }
  render () {
    return (
      <div className="timer">
        <h4>time  </h4>
        <h2 className="time-text">{this.formatTime()}</h2>
      </div>
    )
  }
}
class SocialSharer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      title:encodeURI("Practice English punctuation with this game!"),
      url:encodeURI("https://www.unitedenglish.com.mx/united-english-blog/2018/10/17/phrasal-verbs-game"),
      summary:encodeURI(`I scored ${props.points}! Can you beat me?`),
    }
  }
  createFBLink = () => {
    return `http://www.facebook.com/sharer.php?s=100&p[url]=${this.state.url}`
  }
  createTwitterLink = () => {
    return `http://twitter.com/intent/tweet?text=${this.state.summary}+${this.state.url}`
  }
  render () {
    return (
      <div className="header-20 social">
        <h2>Share this game!</h2>
        <div className="soc-med-icons">
          <a title="send to Facebook"
              href= {this.createFBLink()}
              target="_blank" rel="noopener noreferrer">
            <span>
              <img className="soc-icon" src="https://image.flaticon.com/icons/svg/124/124010.svg" alt="fb-logo"/>
            </span>
          </a>
          <a title="send to Twitter"
            href={this.createTwitterLink()}
            target="_blank" rel="noopener noreferrer">
            <span>
              <img className="soc-icon" src="https://image.flaticon.com/icons/svg/145/145812.svg" alt="twitter-logo"/>
            </span>
          </a>
          </div>
      </div>

    )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      clickedOnId:null,
      dropdownVisible:false,
      dropdownX:0,
      dropdownY:0,
      elementArray:this.replacePunctuation(paragraph[level]['sentence']),
      answersObject:this.getAnswersObj(paragraph[level]['sentence']),
      points:0,
      nextQuestionButtonShown:false,
      timerOn:false,
      verbForms:oVerbForms,
    }
  }

  addPoints = (p) => {
    let points = this.state.points;
    points += p;
    this.setState({points:points});
  }

  checkAnswer = (symbol) => {
    function checkIfAllAnswered(obj) {
      for (let answer in obj) {
        if (!obj[answer].answered) return false;
      }
      return true;
    }
    const id = this.state.id;
    let elArrayCopy = this.state.elementArray;
    let answersObject = this.state.answersObject;
    const correctAnswer = answersObject[id].symbol.toLowerCase();
    this.setState({dropdownVisible:false,});
    if (symbol === correctAnswer) {
      this.addPoints(10);
      for (let i = 0; i < this.state.elementArray.length; i++){
        let el = this.state.elementArray[i];
        if (el.id == id){
          el.answered = true;
          el.content = " " + answersObject[id].symbol + " ";
          elArrayCopy[i] = el;
          answersObject[id].answered = true;

          if (i + 1 < elArrayCopy.length) {
            let textEl = this.state.elementArray[i + 1];
            textEl.answered = true;
            elArrayCopy[i + 1] = textEl;
          }
          this.setState({
            elementArray:elArrayCopy,
            answersObject:answersObject,
          });
          break;
        }
      }
      if (checkIfAllAnswered(answersObject)) this.showNextQuestionButton();
      return true;
    } else {
      this.addPoints(-3);
    }
    return false;
  }

  createText = () => {
    const elArray = this.state.elementArray;
    let resultArray = [];
    let spaceCount = 0;
    for (let i = 0; i < elArray.length; i++){
      let el = elArray[i];
      if(el.type === "text") {
        resultArray.push(<TextSpace text={el.text} key={el.key} answered={el.answered} />)
      } else {
        resultArray.push(<PunctuationSpace
           id={el.id}
           showDropdown={this.showDropdown}
           key={el.key}
           spaceCount={spaceCount}
           answered={el.answered}
           content={el.content}
           startTimer={this.startTimer}
           />)
           spaceCount++;
      }
    }
    return resultArray;
  }

  endGame = () => {
    alert("You win with " + this.state.points + " points.")
  }

  getAnswersObj = (text) => {
    let answersObject = {};
    let textArray = text.split(" ");
    for (let i = 0; i < textArray.length; i++){
      if (replacedText.includes(textArray[i].toLowerCase())) {
        answersObject[i] = {
          symbol:textArray[i],
          answered:(i === textArray.length - 1),
        }
      }
    }
    return answersObject;
  }

  levelUp = () => {
    if (level > Object.keys(paragraph).length - 1) {
      this.endGame();
      return;
    }
    level++;
    this.setState({
      elementArray:this.replacePunctuation(paragraph[level].sentence),
      answersObject:this.getAnswersObj(paragraph[level].sentence),
      timerOn:false,
      nextQuestionButtonShown:false,
    })
  }

  showDropdown = (e, spaceCount) => {
    this.setState({
      clickedSpaceCount:spaceCount,
      dropdownVisible:true,
      dropdownX:e.clientX,
      dropdownY:e.clientY,
      id:e.target.id,
    })
    return "";
  }

  showNextQuestionButton = () => {
    this.setState({
      nextQuestionButtonShown:true,
    });
  }

  replacePunctuation = (text) => {
    let textArray = text.split(" ");
    let resultArray = [];
    let tempPosition = 0;
    for (let i = 0; i < textArray.length; i++){
      if (replacedText.includes(textArray[i].toLowerCase())) {
        resultArray.push({
          text:textArray.slice(tempPosition,i).join(" "),
          key:i + "t",
          type:"text",
          answered:(tempPosition === 0),
        },
        {
          id:i,
          type:"punctuation",
          key: i + "p",
          answered:(i === (textArray.length - 1)),
          content: " ",
        },);
        //resultArray.push(<TextSpace text={textArray.slice(tempPosition,i).join("")} key={i + "t"} />)
        //resultArray.push(<PunctuationSpace id={i} showDropdown={this.showDropdown} key={i + "p"}/>);

        tempPosition = i + 1;
      }
    }
    resultArray.push({
      text:textArray.slice(tempPosition,).join(" "),
      key: textArray.length + "t",
      type:"text",
      answered:(tempPosition === 0),
    })
    return resultArray;
  }

  startTimer = () =>{
    if (!this.state.timerOn) this.setState({timerOn:true});
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <div className="points">
            <h4>points</h4>
            <h2>{this.state.points}</h2>
          </div>
        </div>
        {this.createText()}
        {this.state.dropdownVisible ? <Dropdown
          left={this.state.dropdownX}
          top={this.state.dropdownY}
          addPoints={this.addPoints}
          clickedSpaceCount={this.state.clickedSpaceCount}
          currentVerb={paragraph[level].verb}
          correctVerbSelected={false}
          checkAnswer={this.checkAnswer} /> : "" }
        {this.state.nextQuestionButtonShown ? <div className="next-question-button" onClick={this.levelUp}>Next Question</div> : ""}
        <SocialSharer points={this.state.points} />
      </div>
    );
  }
}

export default App;
