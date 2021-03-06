module.exports = (OpalBot) => {
    const out = {},
    i18n = OpalBot.i18n;

    out.peasants = {};
    out.peasants.reverse = 'imagesearch';
    out.peasants.ris = 'imagesearch';
    out.peasants.reverseimage = 'imagesearch';
    out.peasants.imagesearch = (message, content, lang) => {
        let user = message.mentions.users.first(),
        url = message.attachments.size
            ? message.attachments.first().url
            : user
                ? user.displayAvatarURL
                : content.trim().replace(/^<|>$/g, ''),
        encoded = encodeURIComponent(url),
        google = `https://www.google.com/searchbyimage?image_url=${encoded}`,
        tineye = `https://www.tineye.com/search?url=${encoded}`,
        iqdb = `https://www.iqdb.org/?url=${encoded}`,
        saucenao = `https://saucenao.com/search.php?sort=size&order=desc&url=${encoded}`,
        yandex = `https://yandex.com/images/search?rpt=imageview&img_url=${encoded}`,
        trace = `https://trace.moe/?auto&url=${encoded}`,
        imgops = `http://imgops.com/${url}`;

        message.channel.send({
            embed: {
                color: OpalBot.color,
                title: i18n.msg('title', 'imagesearch', lang),
                url: google,
                image: {
                    url: url
                },
                description: i18n.msg('description', 'imagesearch', yandex, tineye, iqdb, saucenao, trace, imgops, lang)
            }
        }).catch(() => {
            message.reply(i18n.msg('invalid', 'imagesearch', lang)).catch(OpalBot.util.log);
        });
    };

    return out;
};