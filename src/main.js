// Future for yargs command line parsing
const yargs = require('yargs')

const {
    getFiles,
    downloadFiles,
    createDownloadablePaths,
    createNewHtmlWithRelativePaths,
    stripInlineStyles,
    displayLinkedPages,
} = require('./helpers.js')

yargs.command({
    command: 'download',
    describe: 'Download all relevant files based off domain and input.html',
    handler() {
        getFiles()
        createDownloadablePaths()
        downloadFiles()
    }
})

yargs.command({
    command: 'strip',
    describe: 'Remove all Styles and Classnames from input.html directly',
    handler() {
        stripInlineStyles(true)
    }
})

yargs.command({
    command: 'createpath',
    describe: 'Creates new relative paths based on config.js',
    builder: {
        p: {
            describe: 'Appends to the new relative path ex: files/public/newStuff/newStuff/file.pdf',
            demandOption: false,
            type: 'string'
        },
        s: {
            describe: 'Strips inline styles and classes from HTML when creating new HTML file',
            demandOption: false,
            type: 'boolean'
        }
    },
    handler(argv) {
        getFiles()
        createNewHtmlWithRelativePaths(argv.p)
        displayLinkedPages()
        if (argv.s) stripInlineStyles()
    }
})

yargs.parse()