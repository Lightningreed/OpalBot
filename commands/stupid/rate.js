const sha256 = require('js-sha256'),
rand = seed => sha256(seed)
    .split('')
    .map(char => isNaN(char) ? String.fromCharCode(char.charCodeAt(0) - 39) : char)
    .map(char => Math.ceil((char.charCodeAt(0) - 48) / 1.77777) + 1);

module.exports = (OpalBot) => {
    const out = {},
    i18n = OpalBot.i18n;
    
    out.peasants = {};
    // out.peasants.r = 'rate';
    out.peasants.rate = (message, content, lang) => {
        const user = message.mentions.members.first() || content.trim() || message.member,
        identifier = user.id || user.toLowerCase(),
        mentioned = typeof user !== 'string',
        name = mentioned
            ? user.nickname || user.user.username
            : user,
        custom = mentioned
            ? content.replace(/<@[!&]?\d+>/g, '').trim()
            : null,
        criteria = custom ? 0 : Math.floor(Math.random() * 11),
        critName = custom || i18n.msg('criteria-' + (criteria + 1), 'rate', lang),
        doru = [
            null,
            null,
            '11',
            '8',
            null,
            '10',
            'immeasurable',
            '0',
            null,
            '10',
            '6',
        ],
        robyn = [
            '11',
            '10',
            '7',
            '1',
            '1',
            '10',
            'not even trying',
            '11',
            '10',
            '5',
            '6.1',
        ],
        opal = [
            '10',
            '10',
            '10',
            '10',
            '5',
            '10',
            'not today satan',
            '1',
            '10',
            '10',
            '10'
        ],
        rigged = {
            doru,
            '155545848812535808': doru,
            robyn,
            '187524257280950272': robyn,
            opal,
            '348233224293449729': opal,
        },
        result = custom
            ? rand(identifier + custom)
            : rigged[identifier] || rand(identifier);
        
        if (!mentioned && !rigged[identifier]) {
            const n = name.replace(/^(my|your)\b/ig, word => ({
                'your': 'my',
                'my': 'your'
            })[word] || word);
            message.channel.send(i18n.msg('regsult', 'rate', `<@${message.author.id}>`, n, result[criteria], lang));
        } else {
            message.channel.send(i18n.msg('result', 'rate', `<@${message.author.id}>`, name, result[criteria], critName, lang));
        }
    };
    return out;
};
