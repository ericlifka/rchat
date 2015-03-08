let baseUrl = `https://apps.ininsca.com`;
let sessionUrl = `${baseUrl}/api/v2/session`;

$.ajax({
    url: sessionUrl
})
    .done(() => {
        console.log('done', arguments);
    })
    .fail(() => {
        console.log('fail', arguments);
    });
