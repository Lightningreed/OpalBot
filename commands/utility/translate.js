const got = require('got');

module.exports = (OpalBot) => {
    const out = {};
    
    out.peasants = {};
    out.peasants.t = 'translate';
    out.peasants.translate = async (message, content, lang) => {
        const lr = /^[a-z]{2}$/;
        const split = content.split(' ');
        let text,
        from = 'auto',
        to = lang;

        if (split.length == 1) {
            text = split[0];
        } else {
            var s = split[0].split('>');
            if (s.length == 1) {
                if (lr.test(s[0])) {
                    to = split.shift();
                }
            } else {
                if (lr.test(s[0])) {
                    from = s[0];
                }
                if (lr.test(s[1])) {
                    to = s[1];
                }
                split.shift();
            }

            text = split.join(' ');
        }

        const { body } = await got(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`, {
            json: true
        });

        OpalBot.util.log(JSON.stringify(body, null, 2));

        let results = body[0],
        translation = results.map(res => res[0]).join('');

        message.channel.send(`> ${text}\n${translation}`);
    };

    return out;
};