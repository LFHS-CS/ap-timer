export class Time {
    static readonly SECONDS_IN_HOUR = 3600;
    static readonly SECONDS_IN_MINUTE = 60;
    seconds: number;

    constructor(seconds?: number) {
        if (seconds) {
            this.seconds = seconds;
        }
        else {
            this.seconds = 0;
        }
    }

    update() {
        this.seconds -= 1;
    }

    display(): string {
        let time = this.seconds;
        let hours = Math.floor(time / Time.SECONDS_IN_HOUR);
        time = time - (hours * Time.SECONDS_IN_HOUR);
        let minutes = Math.floor(time / Time.SECONDS_IN_MINUTE);
        time = time - (minutes * Time.SECONDS_IN_MINUTE);
        let seconds = time;
        return "${hours}:${minutes}:${seconds}";
    }
}