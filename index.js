var bleno = require('bleno');
var spawn = require("child_process").spawn;

var name = 'raspberrypi';
var serviceUuids = ['180F'];

var primaryService = new bleno.PrimaryService({
    uuid: 'F1D8C0D1-4A4F-4B43-9A5B-7C59BD85EE57',
    characteristics: [
        new bleno.Characteristic({
	    //illumination type
            uuid: 'F1D8C0D1-4A4F-4B43-9A5B-7C59BD85EE58',
            properties: ['write'],
            value: new Buffer([0x00]),
            onWriteRequest: function(data, offset, withoutResponse, callback) { 
                console.log('write', data);
            }
	})
	,new bleno.Characteristic({
            uuid: 'F1D8C0D1-4A4F-4B43-9A5B-7C59BD85EE59',
            properties: ['write'],
            value: new Buffer([0x00, 0x00, 0x00]),
            onWriteRequest: function(data, offset, withoutResponse, callback) { 
                console.log('write', data);
                var process = spawn('python',["strandtest.py", data[0], data[1], data[2]]);
            }
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
