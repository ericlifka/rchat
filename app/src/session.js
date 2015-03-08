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
            let requestData = {
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
                email: Credentials.username,
                password: Credentials.password
            };

            $.ajax({
                type: "POST",
                url: loginUrl,
                data: JSON.stringify(requestData),
                contentType: 'application/json',
                dataType: 'json'
            })
                .fail(reject)
                .done(function ({res}) {
                    let cookie = 'X-OrgBook-Auth-Key';
                    let value = res[cookie];

                    $.cookie(cookie, value, { expires: 7 });
                    resolve();
                });
        });
    }
};