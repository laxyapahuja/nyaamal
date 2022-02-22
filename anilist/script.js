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
    let string = `<div data-v-19b948c8="" data-v-515ea5f2="">
    <h2 data-v-19b948c8="" class="link">
        <a data-v-19b948c8="" class="">Torrents</a> 
        <a data-v-19b948c8="" class="create">Sort</a><select id="sorter">
        <option value="time">Sort: Time - Ascending</option>
        <option value="-time">Sort: Time - Descending</option>
        <option value="seeders">Sort: Seeds - Ascending</option>
        <option value="-seeders">Sort: Seeds - Descending</option>
        <option value="size">Sort: File size - Ascending</option>
        <option value="-size">Sort: File size - Descending</option>
        </select> <button onclick="sort()">Sort</button>
    </h2>`
    for (let i = (10 * pageCount); i < ((10 * pageCount) + endLimitDiscriminator()); i++) {
        string += `
        <div style="width: 62vw; height: fit-content; background-color: white">
            <div style="display: flex; justify-content: space-between">
                <div style="width: 50vw; height: fit-content; padding: 1.3vw;">
                    <a href="${torrents[i].link}" class="title" target="_blank"><span>${torrents[i].title}</span><a>
                    <h2 style="position: relative; bottom: -1vw;">${torrents[i].time} | ${torrents[i].size}</h2>
                </div>
                <div style="width: 10vw; height: fit-content; padding: 1.3vw; text-align: right">
                    <span data-v-70ae1ba4="">${torrents[i].seeders} ↑</span> 
                    <span data-v-70ae1ba4="">${torrents[i].leechers} ↓</span><br><br>     
                    <span data-v-51e37344="" data-v-70ae1ba4="" style="margin-left: -1vw; position: relative; bottom: -1vw;">
                        <a data-v-51e37344="" href="${torrents[i].magnet}" class="category" style="background: rgb(103, 58, 183);" target="_blank">magnet</a>
                    </span>
                </div>
             </div>
        </div>
        <br>
        `
    }
    string += `</div><center><p id="torrent-current-page">${pageCount+1}/${pages()}</center><center><a onclick="pageBack();" style="margin-right: 5px; cursor: pointer;">Back</a><a onclick="pageNext();" style="cursor: pointer;">Next</a></center></br>`
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