import Credentials from './credentials';

$.get(sessionUrl)
    .done(function () {
        console.log('session - done', arguments);
    })
    .fail(function () {
        console.log('session - fail', arguments);


    });
