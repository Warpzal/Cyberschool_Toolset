const fs = require('fs')

const input = fs.readFileSync('../input.html', 'utf-8')
// Don't include the / at the end on domain
// Leave blank if you want to download everything (TODO)
const domain = 'http://www.asd103.org'
const cyberschool_domain = 'http://anacortessd.cyberschool.com/'

const newRelativePath = `/files/public_files/`
const downloadsDirectory = '../Downloads'

// If you want to auto create pages or auto download content
const username = 'arodriguez'
const password = 'awesome9'

module.exports = {
    input,
    domain,
    cyberschool_domain,
    newRelativePath,
    downloadsDirectory,
    username,
    password,
}
