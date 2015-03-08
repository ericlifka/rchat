import { sessionUrl, loginUrl } from './resources';

export default {
    checkSession() {
        return new Promise((resolve, reject) => {
            $.get(sessionUrl)
                .done(resolve)
                .fail(reject);
        });
    },
    login(username, password) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: loginUrl,
                data: this.requestData(username, password),
                contentType: 'application/json',
                dataType: 'json'
            })
                .fail(reject)
                .done(function ({res}) {
                    let cookie = 'X-OrgBook-Auth-Key';
                    $.cookie(cookie, res[cookie], { expires: 7 });
                    resolve();
                });
        });
    },
    requestData(username, password) {
        return JSON.stringify({
            client: "rchat",
            clientVersion: "0.0.1",
            detail: {
                semver: "rchat-alpha",
                userAgent: window.navigator.userAgent
            },
            extendedSession: false,
            includeFieldConfigs: false,
            includeRoleInfo: false,
            includeTranslations: false,
            lang: "en_us",
            email: username,
            password: password
        });
    }
};