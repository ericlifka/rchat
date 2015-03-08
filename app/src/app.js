import Credentials from './credentials';
import Session from './session';

function bootstrapApp() {
    console.log('bootstrap');

    let rt = window.rt = new Realtime({
        jidResource: 'emberchat',
        jidRouting: true,
        focusV2: true,
        roomsV2: true,
        offlineJoinNotifications: true,
        debug: []
    });

    rt.on('connect', () => {
        console.log('connect');
    });

    rt.on('disconnect', () => {
        console.log('disconnect');
    });

    rt.on('message', () => {
        console.log('message');
    });

    rt.on('status', () => {
        console.log('status');
    });

    rt.on('activeChat', () => {
        console.log('activeChat');
    });

    rt.on('presence', () => {
        console.log('presence');
    });

    rt.connect();
}

Session.checkSession()
    .then(bootstrapApp)
    .catch(() => {
        Session.login(Credentials.username, Credentials.password)
            .then(bootstrapApp)
            .catch(() => {
                console.log("Error - couldn't log in");
            });
    });
