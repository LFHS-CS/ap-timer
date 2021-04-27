import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { stringify } from 'node:querystring';
import { TimeView } from './TimerView'

interface AppProps {};

interface AppState {
  remainingTime: number;
  remainingInstantaneousTime: number;
  hours: number;
  minutes: number;
  questions: number;
  startQuestions: number;
  key: number;
  interval: any;
  instantaneousInterval: any;
};

const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

export default class App extends React.Component<AppProps, AppState>  {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      remainingTime: 0,
      remainingInstantaneousTime: 0,
      questions: 0,
      startQuestions: 0,
      hours: 0,
      minutes: 0,
      key: 0,
      interval: null,
      instantaneousInterval: null,
    }

    this.startTimer = this.startTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.updateInstantaneousTimer = this.updateInstantaneousTimer.bind(this);
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

    if (this.state.instantaneousInterval) {
      clearInterval(this.state.instantaneousInterval)
    }
  }

  handleHourChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({hours: Number(e.target.value)});
  }

  handleMinuteChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({minutes: Number(e.target.value)});
  }

  handleQuestionsChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({questions: Number(e.target.value), startQuestions: Number(e.target.value)});
  }

  updateInstantaneousTimer() {
    this.setState({
      remainingInstantaneousTime: this.state.remainingInstantaneousTime - 1,
    });
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

    if (this.state.instantaneousInterval) {
      clearInterval(this.state.instantaneousInterval);
    }

    this.setState({
      remainingInstantaneousTime: 0,
      remainingTime: 0,
      startQuestions: 0,
      questions: 0,
      key: this.state.key + 1,
    })
  }

  startTimer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }

    let maximumTime = this.state.hours * SECONDS_IN_HOUR + this.state.minutes * SECONDS_IN_MINUTE;
    this.setState({remainingTime: maximumTime, remainingInstantaneousTime: Math.floor(maximumTime / this.state.questions)});

    
    let intervalID = setInterval(this.updateTimer, 1000)
    let instantaneousIntervalID = setInterval(this.updateInstantaneousTimer, 1000)
    this.setState({interval: intervalID, instantaneousInterval: instantaneousIntervalID});
  }

  nextQuestion(e: React.MouseEvent<HTMLButtonElement>) {
    if (this.state.instantaneousInterval) {
      clearInterval(this.state.instantaneousInterval);
    }

    let intervalID = setInterval(this.updateInstantaneousTimer, 1000)

    this.setState({
      questions: this.state.questions - 1, 
      remainingInstantaneousTime: Math.floor(this.state.remainingTime / this.state.questions),
      instantaneousInterval: intervalID,
    });
  }

  render() {
    return (
      <div className="App">
        <h1>AP Multiple Choice Timer</h1>
        <div>
          <form onSubmit={this.startTimer}>
            <label className="form-input">Hours
              <input key={this.state.key} type="number" onChange={this.handleHourChange}/>
            </label>
            <label className="form-input">Minutes
              <input key={this.state.key} type="number" onChange={this.handleMinuteChange}/>
            </label>
            <label className="form-input">Questions
              <input key={this.state.key} type="number" onChange={this.handleQuestionsChange}/>
            </label>
            <input type="submit" value="Start" />
          </form>
        </div>
        <div>
          {this.state.questions > 0 && this.state.remainingTime > 0 &&
          <TimeView remainingInstantaneousTime={this.state.remainingInstantaneousTime} 
                    remainingTime={this.state.remainingTime} 
                    questions={this.state.questions} 
                    startQuestions={this.state.startQuestions} />
          }
        </div>
        <div>
          <div>
            <Button variant="primary" onClick={this.nextQuestion}>Next Question</Button>
          </div>
          <div>
            <Button variant="danger" onClick={this.restart}>Reset</Button>
          </div>
        </div>
      </div>
    );
  }
}