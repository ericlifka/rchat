import Credentials from './credentials';
import Session from './session';

function bootstrapApp() {
    console.log('bootstrap');
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
