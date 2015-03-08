let baseUrl = `/directory-api`;
let sessionUrl = `${baseUrl}/api/v2/session`;
let loginUrl = `${baseUrl}/api/v2/login`;

$.get(sessionUrl)
    .done(function () {
        console.log('session - done', arguments);
    })
    .fail(function () {
        console.log('session - fail', arguments);

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
            email: "..snip..",
            password: "..snip.."
        };

        $.ajax({
            type: "POST",
            url: loginUrl,
            data: JSON.stringify(requestData),
            contentType: 'application/json',
            dataType: 'json'
        })
            .done(function () {
                console.log('login - done', arguments);
            })
            .fail(function () {
                console.log('login - fail', arguments);
            })
    });
