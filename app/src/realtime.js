export default () => new Realtime({
    jidResource: 'emberchat',
    jidRouting: true,
    focusV2: true,
    roomsV2: true,
    offlineJoinNotifications: true,
    debug: []
});