const yargs = require('yargs')
const fs = require('fs')

const {
    getFiles,
    downloadFiles,
    createDownloadablePaths,
    createNewHtmlWithRelativePaths,
    stripInlineStyles,
    displayLinkedPages,
} = require('./helpers.js')

const {
    createCyberschoolPage,
    uploadDocumentsToCyberschool,
} = require('./scrape.js')

yargs.command({
    command: 'createpage',
    describe: 'Create Page from output.html and title paramater',
    builder: {
        t: {
            describe: 'Title of page',
            demandOption: true,
            type: 'string',
        },
    },
    async handler(argv) {
        const html = fs.readFileSync('../output.html', 'utf-8')
        await createCyberschoolPage(argv.t, html)
    },
})

yargs.command({
    command: 'download',
    describe: 'Download all relevant files based off domain and input.html',
    builder: {
        u: {
            describe: 'Upload files automatically to cyberschool',
            demandOption: false,
            type: 'boolean',
        },
    },
    async handler(argv) {
        getFiles()
        createDownloadablePaths()
        downloadFiles()
        if (argv.u) {
            await uploadDocumentsToCyberschool()
        }
    },
})

yargs.command({
    command: 'strip',
    describe: 'Remove all Styles and Classnames from input.html directly',
    handler() {
        stripInlineStyles(true)
    },
})

yargs.command({
    command: 'createpath',
    describe: 'Creates new relative paths based on config.js',
    builder: {
        p: {
            describe:
                'Appends to the new relative path ex: files/public/newStuff/newStuff/file.pdf',
            demandOption: false,
            type: 'string',
        },
        s: {
            describe:
                'Strips inline styles and classes from HTML when creating new HTML file',
            demandOption: false,
            type: 'boolean',
        },
    },
    handler(argv) {
        getFiles()
        createNewHtmlWithRelativePaths(argv.p)
        displayLinkedPages()
        if (argv.s) stripInlineStyles()
    },
})

yargs.parse()
