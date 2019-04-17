const uuid = require('uuid/v4');
const _ = require('lodash');
const faker = require("faker");
const path = require('path');

const CALLS = path.join(__dirname, 'calls');

const fs = require('fs');
const ITEMS = 2000;
const TRANSCRIPT_LENGTH = 500;
const INDEX = path.join(__dirname, 'calls.json');

const categories = 'sales,complaint,support,angry,happy,confused,robocall,internal'.split(',');
const allSpeakers = _.range(0, 30).map(() => faker.fake("{{name.firstName}} {{name.lastName}}"));

fs.readdir(CALLS, (err, files) => {
    console.log('files', files)
    files.forEach(file => fs.unlinkSync(path.join(CALLS, file), () => {
    }));

    fs.writeFile(INDEX, '{"media": [', () => {
        fileHandle = fs.openSync('war.txt', 'r');
        console.log('file handle:', fileHandle);

        _.range(0, ITEMS).forEach((i) => {
            console.log('reading item', i);
            let b = Buffer.alloc(TRANSCRIPT_LENGTH);
            fs.read(fileHandle, b, 0, TRANSCRIPT_LENGTH, i * TRANSCRIPT_LENGTH, (err, bytesRead, buffer) => {
                console.log('read ', i, err, bytesRead, buffer);
                let mediaId = uuid();
                let transcript = buffer.toString('utf8')
                    .replace(/^[^ ]+ /, '')
                    .replace(/[^ ]+ $/, '');

                console.log('saving ', mediaId, 'with ', transcript.toString().substr(0, 20));
                let createdDate = faker.date.past(4);
                let speakers = _.shuffle(allSpeakers).slice(0, _.random(1, 2));
                console.log('speakers:', speakers);
                let cats = _(categories).shuffle().slice(0, _.random(0, 4)).value();

                const json = JSON.stringify({
                    mediaId,
                    transcript,
                    createdDate: createdDate.toISOString(),
                    speakers,
                    categories: cats
                }, true, 4);
                fs.writeFile(path.join(CALLS, mediaId + '.json'), json, function () {
                    if (i) {
                        fs.appendFileSync(INDEX, ',')
                    }
                    fs.appendFileSync(INDEX, json, () => {
                    });
                    if (i === ITEMS - 1) {
                        fs.appendFileSync(INDEX, ']}', () => {
                        });
                    }
                });
            });

        });
    });

});
