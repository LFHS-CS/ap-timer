import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { stringify } from 'node:querystring';

interface TimerViewProps {
    remainingInstantaneousTime: number;
    remainingTime: number;
    questions: number;
    startQuestions: number;
};

interface TimerViewState {
};

const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

export class TimeView extends React.Component<TimerViewProps, TimerViewState>  {
    constructor(props: TimerViewProps) {
        super(props)

        this.formatTime = this.formatTime.bind(this)
    }

    formatTime(timeInSeconds: number): string {
        let negative = timeInSeconds < 0
        let time = Math.abs(timeInSeconds);
        let hours = Math.floor(time / SECONDS_IN_HOUR);
        time = time - (hours * SECONDS_IN_HOUR);
        let minutes = Math.floor(time / SECONDS_IN_MINUTE);
        time = time - (minutes * SECONDS_IN_MINUTE);
        let seconds = time;
        return ((negative)?"-":"") + "" + String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
    }

    render() {
        let timeString = this.formatTime(this.props.remainingTime);
        let timePerQuestions = this.formatTime(Math.floor(this.props.remainingTime / this.props.questions));
        let instantaneousTimePerQuestion = this.formatTime(this.props.remainingInstantaneousTime);
        let color = (this.props.remainingInstantaneousTime < 0)?"text-danger":"text-success";

        return (
            <div className="timerContainer">
                <p>Remaining Time: {timeString}</p>
                <p>Time/Question: {timePerQuestions}</p>
                <p className={color}>Time Remaining on Question: {instantaneousTimePerQuestion}</p>
                <p>Questions: {this.props.startQuestions} </p>
                <p>Remaining Questions: {this.props.questions} </p>
            </div>
        )
    }
}