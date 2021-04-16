const API = 'https://nyaaapi.herokuapp.com/nyaa/anime?query='

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

let animeTitle = document.getElementsByTagName('strong')[0].innerText
let songInfoElement = document.getElementsByClassName('di-t')[1]
let torrentElement = document.createElement('div')

let torrentsCount = 0
let torrents = []
let pageCount = 0

function inflator(torrents) {
    let string = `<h2>Torrents</h2><table class="table-recently-updated" width="100%" cellspacing="0" cellpadding="0" border="0"><tbody>`
    for (let i = (10 * pageCount); i < ((10 * pageCount) + endLimitDiscriminator()); i++) {
        string += `<tr><td class="borderClass di-t w100">
    <div><a href="${torrents[i].link}">${torrents[i].title}</a>
    <p style="float:right;">${torrents[i].size}</p></div>
    <div><a style="float:left; margin-right: 5px;" href="${torrents[i].magnet}">Magnet</a>
    <p style="float:left;">${torrents[i].seeders}↑</p><p style="float:left;">${torrents[i].leechers}↓</p>
    <p style="float:right;">${torrents[i].time}</p></div></td></tr>`
    }
    string += `</tbody></table><center><p id="torrent-current-page">${pageCount+1}/${pages()}</center><center><a onclick="pageBack();" style="margin-right: 5px; cursor: pointer;">Back</a><a onclick="pageNext();" style="cursor: pointer;">Next</a></center>`
    torrentElement.innerHTML = string
}

function pageNext() {
    if (torrentsCount >= ((pageCount + 1) * 10)) {
        pageCount += 1
        inflator(torrents)
    }
}

function pageBack() {
    if (pageCount != 0) {
        pageCount -= 1
        inflator(torrents)
    }
}

function endLimitDiscriminator() {
    if (pageCount >= parseInt(torrentsCount / 10)) {
        return torrentsCount % 10
    } else {
        return 10
    }
}

function pages() {
    return (parseInt(torrentsCount / 10) + 1)
}

try {
    fetch(API + animeTitle)
        .then((response) => {
            console.log(response)
            response.json().then((res) => {
                torrents = res.data
                torrentsCount = res.count
                inflator(res.data)
                insertAfter(songInfoElement, torrentElement)
            })
        })
} catch (err) {
    console.log(err)
}