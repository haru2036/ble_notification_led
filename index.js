var bleno = require('bleno');

var name = 'raspberrypi';
var serviceUuids = ['180F'];

var primaryService = new bleno.PrimaryService({
    uuid: 'F1D8C0D1-4A4F-4B43-9A5B-7C59BD85EE57',
    characteristics: [
        new bleno.Characteristic({
	    //illumination type
            uuid: 'F1D8C0D1-4A4F-4B43-9A5B-7C59BD85EE58',
            properties: ['write'],
            value: new Buffer([0x00])})
	,new bleno.Characteristic({
            uuid: 'F1D8C0D1-4A4F-4B43-9A5B-7C59BD85EE59',
            properties: ['write'],
            value: new Buffer([0x00, 0x00, 0x00]),
        })
    ]
});

bleno.on('stateChange', function(state) {
    console.log('stateChange: '+state);
    if (state === 'poweredOn') {
        bleno.startAdvertising(name, serviceUuids, function(error){
            if (error) console.error(error);
        });
    } else {
        bleno.stopAdvertising();
    }
});
bleno.on('advertisingStart', function(error){
    if (!error) {
        console.log('start advertising...');
        bleno.setServices([primaryService]);
    } else {
        console.error(error);
    }
});
