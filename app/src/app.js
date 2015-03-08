let baseUrl = `/directory-api`;
let sessionUrl = `${baseUrl}/api/v2/session`;
let loginUrl = `${baseUrl}/api/v2/login`;

$.get(sessionUrl)
    .done(() => {
        console.log('session - done', arguments);
    })
    .fail(() => {
        console.log('session - fail', arguments);

        let requestData = {
            client: "web",
            clientVersion: "2.4.0",
            detail: {
                semver: "2.4.0+1036-origin/release/2.4.0-ccdcb43a60efd487c59fda2ff2fecc27e45f97a6",
                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36"
            },
            extendedSession: false,
            includeFieldConfigs: false,
            includeRoleInfo: false,
            includeTranslations: false,
            lang: "en_us",
            email: "...snip...",
            password: "...snip..."
        };

        $.ajax({
            type: "POST",
            url: loginUrl,
            data: JSON.stringify(requestData),
            dataType: 'application/json'
        })
            .done(() => {
                console.log('login - done');
            })
            .fail(() => {
                console.log('login - fail');
            })
    });
