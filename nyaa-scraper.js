let nyaaScraper = async(animeTitle) => {
    const NYAA_WEBSITE = 'https://nyaa.net/search/'

    let pages = 2

    function torrentPageWise(pageNo) {
        return new Promise((resolve, reject) => {
            let torrents = []
            fetch(`https://cors-anywhere.herokuapp.com/${NYAA_WEBSITE}${pageNo}/?q=${animeTitle}`)
                .then((response) => {
                    response.text().then(async(res) => {
                        console.log(pageNo)
                        let rows = res.split('<tr id=')
                        rows.shift()
                        rows.pop()
                        rows.forEach(async(row, index) => {
                            torrent = {}
                            torrent.link = 'https://nyaa.net' + row.split(`<td class="tr-name home-td"`)[1].split('"')[3]
                            torrent.title = row.split(`<td class="tr-name home-td"`)[1].split('>')[2].split('<')[0].trim()
                            torrent.magnet = row.split(`<td class="tr-links home-td">`)[1].split(`"`)[1]
                            torrent.seeders = parseInt(row.split(`<td class="tr-se home-td hide-smol">`)[1].split(`</td>`)[0].trim())
                            torrent.leechers = parseInt(row.split(`<td class="tr-le home-td hide-smol">`)[1].split(`</td>`)[0].trim())
                            torrent.time = row.split(`<td class="tr-date home-td date-short hide-xs"`)[1].split(`"`)[1]
                            torrent.size = row.split(`<td class="tr-size home-td hide-xs">`)[1].split(`</td>`)[0].trim()
                            torrents.push(torrent)
                        })
                    })
                })
            resolve(torrents)
        })
    }

    try {
        let promises = []
        for (let pageNo = 1; pageNo <= pages; pageNo++) {
            promises.push(torrentPageWise(pageNo))
            if (pages == pageNo) {
                await Promise.all(promises).then(torrents => {
                    return torrents
                })
            }
        }
    } catch (err) {
        console.log(err)
    }
}