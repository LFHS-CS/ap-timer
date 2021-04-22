import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { stringify } from 'node:querystring';

interface AppProps {};

interface AppState {
  remainingTime: number;
  hours: number;
  minutes: number;
  questions: number;
  key: number;
  interval: any;
};

const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

export default class App extends React.Component<AppProps, AppState>  {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      remainingTime: 0,
      questions: 0,
      hours: 0,
      minutes: 0,
      key: 0,
      interval: null,
    }

    this.startTimer = this.startTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.handleHourChange = this.handleHourChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.handleQuestionsChange = this.handleQuestionsChange.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.restart = this.restart.bind(this);
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval)
    }
  }

  startTimer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }

    this.setState({remainingTime: this.state.hours * SECONDS_IN_HOUR + this.state.minutes * SECONDS_IN_MINUTE});

    let intervalID = setInterval(this.updateTimer, 1000)
    this.setState({interval: intervalID});
  }

  handleHourChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({hours: Number(e.target.value)});
  }

  handleMinuteChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({minutes: Number(e.target.value)});
  }

  handleQuestionsChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({questions: Number(e.target.value)});
  }

  nextQuestion(e: React.MouseEvent<HTMLButtonElement>) {
    this.setState({questions: this.state.questions - 1});
  }

  updateTimer() {
    this.setState({
      remainingTime: this.state.remainingTime - 1,
    });
  }

  restart() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }

    this.setState({
      remainingTime: 0,
      questions: 0,
      key: this.state.key + 1,
    })
  }

  formatTime(timeInSeconds: number): string {
    let time = timeInSeconds;
    let hours = Math.floor(time / SECONDS_IN_HOUR);
    time = time - (hours * SECONDS_IN_HOUR);
    let minutes = Math.floor(time / SECONDS_IN_MINUTE);
    time = time - (minutes * SECONDS_IN_MINUTE);
    let seconds = time;
    return "" + String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
}

  render() {
    let timeString = this.formatTime(this.state.remainingTime);
    let timePerQuestions = this.formatTime(Math.floor(this.state.remainingTime / this.state.questions));
    return (
      <div className="App">
        <h1>AP Multiple Choice Timer</h1>
        <div>
          <form onSubmit={this.startTimer}>
            <label>Hours
              <input key={this.state.key} type="number" onChange={this.handleHourChange}/>
            </label>
            <label>Minutes
              <input key={this.state.key} type="number" onChange={this.handleMinuteChange}/>
            </label>
            <label>Questions
              <input key={this.state.key} type="number" onChange={this.handleQuestionsChange}/>
            </label>
            <input type="submit" value="Start" />
          </form>
        </div>
        {this.state.remainingTime > 0 &&
          <div>
          <p>Remaining Time: {timeString}</p>
          </div>
        }
        {this.state.questions > 0 &&
          <div>
            <p>Time/Question: {timePerQuestions}</p>
          </div>
        }
        <div>
          <Button variant="primary" onClick={this.nextQuestion}>Next Question</Button>
          <Button variant="danger" onClick={this.restart}>Reset</Button>
        </div>
      </div>
    );
  }
}