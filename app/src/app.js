let baseUrl = `/directory-api`;
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
