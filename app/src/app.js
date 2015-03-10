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
        this.realtime
            .on('message', desc => this.onMessage(desc))
            .on('invite', desc => this.onInvite(desc))
            .on('activeChat', desc => this.onActiveChat(desc))
            .on('occupantChange', desc => this.onOccupantChange(desc))
            .on('presence', desc => this.onPresence(desc))
            .on('subjectChange', desc => this.onSubjectChange(desc));
    }

    onMessage(message) {

    }

    onInvite({roomJid}) {

    }

    onActiveChat(desc) {

    }

    onOccupantChange(desc) {

    }

    onPresence(desc) {

    }

    onSubjectChange(desc) {

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
