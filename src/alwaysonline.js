// This file isn't supposed to be pretty, or well coded, or maintainable. It's a hack.

const request = require('request'),
config = require('./config.js'),

get_ms_until_next_swap = (d) => {
    if (
        d.getDate() < 15
    ) {
        return new Date(d.getFullYear(), d.getMonth(), 15).getTime() - Date.now();
    } else {
        return new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime() - Date.now();
    }
},

get_ids = (appname, token) => {
    return new Promise((res, rej) => {
        request('https://api.heroku.com/teams/apps/' + appname, {
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/vnd.heroku+json; version=3'
            }
        }, (err, r, body) => {
            if (err) {
                rej(err);
                return;
            }

            body = JSON.parse(body);

            request(`https://api.heroku.com/apps/${body.id}/formation`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/vnd.heroku+json; version=3'
                }
            }, (err, r, body) => {
                if (err) {
                    rej(err);
                    return;
                }

                body = JSON.parse(body)[0];

                res([body.app.id, body.id]);
            });
        });
    });
},

get_all_ids = (config) => {
    return Promise.all([
        get_ids(config.app_name, config.heroku_token),
        get_ids(config.backup_app_name, config.backup_heroku_token)
    ]);
},

scale = (ids, num, token) => {
    return new Promise((res, rej) => {
        request.patch(`https://api.heroku.com/apps/${ids[1]}/formation/${ids[0]}`, {
            form: {
                quantity: num,
                size: 'Free',
                type: 'web'
            },
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/vnd.heroku+json; version=3'
            }
        }, (err, r, body) => {
            if (err) {
                rej(err);
                return;
            }

            res(body);
        });
    });
};

get_all_ids(config).then(arr => {
    let [
        app,
        backup
    ] = arr,
    d = new Date();

    setTimeout(() => {
        scale( // turn on that other app
            config.is_backup ? app : backup,
            1,
            config.is_backup ? config.heroku_token : config.backup_heroku_token
        ).then(() => {
            scale( // turn off our app
                config.is_backup ? backup : app,
                0,
                config.is_backup ? config.backup_heroku_token : config.heroku_token
            )
        })
    }, Math.max(get_ms_until_next_swap, 0));
});