const fs = require('fs')

const input = fs.readFileSync('../input.html', 'utf-8')
// Don't include the / at the end on domain
// Leave blank if you want to download everything (TODO)
const domain = 'http://fakeschool.com'
const newRelativePath = `/files/public_files/`
const downloadsDirectory = '../Downloads'

module.exports = {
    input,
    domain,
    newRelativePath,
    downloadsDirectory,
}
