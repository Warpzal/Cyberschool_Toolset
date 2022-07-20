const fs = require('fs')
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n')

const headings = {
    location: 'Office Location',
    phone: 'Phone Number',
    fax: 'Fax Number',
    hours: 'Office Hours',
}

let output = ``
input.forEach((line) => {
    if (line.includes(Object.keys(headings))) {
    }
})

function createHTMLOuter() {}
