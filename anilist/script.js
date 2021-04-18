const API = 'https://nyaaapi.herokuapp.com/nyaa/anime?query='

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

let animeTitle = document.getElementsByTagName('h1')[0].innerText
let statusDistributionElement = document.getElementsByClassName('staff')[6]
let torrentElement = document.createElement('div')

let torrentsCount = 0
let torrents = []
let pageCount = 0

function inflator(torrents) {
    let string = `<h2>Torrents</h2><table class="table-recently-updated" width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><select id="sorter">
    <option value="time">Sort: Time - Ascending</option>
    <option value="-time">Sort: Time - Descending</option>
    <option value="seeders">Sort: Seeds - Ascending</option>
    <option value="-seeders">Sort: Seeds - Descending</option>
    <option value="size">Sort: File size - Ascending</option>
    <option value="-size">Sort: File size - Descending</option>
    </select> <button onclick="sort()">Sort</button>`
    for (let i = (10 * pageCount); i < ((10 * pageCount) + endLimitDiscriminator()); i++) {
        string += `<tr><td class="borderClass di-t w100">
    <div><a href="${torrents[i].torrent_file}">${torrents[i].title}</a>
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

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    if (property == 'time') {
        return function(a, b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (Date(a[property]) < Date(b[property])) ? -1 : (Date(a[property]) > Date(b[property])) ? 1 : 0;
            return result * sortOrder;
        }
    } else if (property == 'seeders') {
        return function(a, b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (parseInt(a[property]) < parseInt(b[property])) ? -1 : (parseInt(a[property]) > parseInt(b[property])) ? 1 : 0;
            return result * sortOrder;
        }
    } else if (property == 'size') {
        torrents.forEach((torrent, index) => {
            if (torrent.size[torrent.size.length - 3] == 'G') {
                torrent.mb = (parseFloat(torrent.size.split()[0]) * 1024)
            } else {
                torrent.mb = parseFloat(torrent.size.split()[0])
            }
        })
        return function(a, b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (parseFloat(a['mb']) < parseFloat(b['mb'])) ? -1 : (parseFloat(a['mb']) > parseFloat(b['mb'])) ? 1 : 0;
            return result * sortOrder;
        }
    }
}

function sort() {
    let e = document.getElementById("sorter");
    let value = e.options[e.selectedIndex].value;
    torrents.sort(dynamicSort(value))
    pageCount = 0
    inflator(torrents)
}

try {
    fetch(API + animeTitle)
        .then((response) => {
            console.log(response)
            response.json().then((res) => {
                torrents = res.data
                torrentsCount = res.count
                inflator(res.data)
                insertAfter(statusDistributionElement, torrentElement)
            })
        })
} catch (err) {
    console.log(err)
}