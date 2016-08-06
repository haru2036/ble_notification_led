var bleno = require('bleno');
var Characteristic = bleno.Characteristic;
var spawn = require("child_process").spawn;

var name = 'raspberrypi';
var serviceUuids = ['F1D8C0D14A4F4B43-9A5B7C59BD85EE57'];
var process = undefined;

var primaryService = new bleno.PrimaryService({
    uuid: 'F1D8C0D14A4F4B439A5B7C59BD85EE57',
    characteristics: [
        new bleno.Characteristic({
	    //illumination type
            uuid: 'F1D8C0D14A4F4B439A5B7C59BD85EE58',
            properties: ['write'],
            value: new Buffer([0x00]),
            onWriteRequest: function(data, offset, withoutResponse, callback) { 
                console.log('write', data);
		callback(Characteristic.RESULT_SUCCESS);
            }
	})
	,new bleno.Characteristic({
            uuid: 'F1D8C0D14A4F4B439A5B7C59BD85EE59',
            properties: ['write'],
            value: new Buffer([0x00, 0x00, 0x00]),
            onWriteRequest: function(data, offset, withoutResponse, callback) { 
                console.log('write', data);
                if(process != undefined){
                process.kill();
                }
                process = spawn('python', ["./strandtest.py", data[0].toString(16), data[1].toString(16), data[2].toString(16)]);
                console.log('r', data[0]);
                console.log('g', data.readUInt8(1));
                console.log('b', data[2]);
		callback(Characteristic.RESULT_SUCCESS);
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
