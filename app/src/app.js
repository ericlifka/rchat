import Credentials from './credentials';
import Session from './session';
import realtime from './realtime';

class ChatApp {
    constructor() {
        this.realtime = realtime();
        this.attachToEvents();
    }

    connect() {
        this.realtime.connect();
    }

    attachToEvents() {

    }
}

const app = new ChatApp();

function bootstrapApp() {
    app.connect();
}

Session.checkSession()
    .then(bootstrapApp)
    .catch(() => Session.login(Credentials.username, Credentials.password)
        .then(bootstrapApp)
        .catch(() => console.log("Error - couldn't log in")));

//
//rt.on('connect', () => {
//    console.log('connect');
//});
//
//rt.on('disconnect', () => {
//    console.log('disconnect');
//});
//
//rt.on('message', () => {
//    console.log('message');
//});
//
//rt.on('status', () => {
//    console.log('status');
//});
//
//rt.on('activeChat', () => {
//    console.log('activeChat');
//});
//
//rt.on('presence', () => {
//    console.log('presence');
//});
//
//rt.connect();
