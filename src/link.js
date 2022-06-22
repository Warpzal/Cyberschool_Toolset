const fs = require('fs')
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n')
input.pop()

const links = {}

input.forEach(line => {
  const regex = /(.+)\((.+)\)/
  const [_,label, link] = line.match(regex)
  links[label] = link
})

function convertLinksToHTML(links) {
  const anchorTags = []
  for (label of Object.keys(links)) {
    anchorTags.push(`<li><a href="${links[label]}" target="_blank">${label}</a></li>`)
  }
  return anchorTags
}

const html = convertLinksToHTML(links)
html.forEach(element => console.log(element))
