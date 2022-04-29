const util = require("util")
const exec = util.promisify(require("child_process").exec)
const fs = require("fs")

const { domain, input, newRelativePath, downloadsDirectory } = require("./config.js")

//  List of files in href="bleh" src="bleh"
let files = []

// Contains all files to transfer but as their full paths
// ex: /cms/blah.png -> https://domain.com/cms/blah.png
let absolutePaths = []

// Contains new paths for domain transfer
// ex: /path/filename
let relativePaths = []

const REGEX_FILE_NAME = /[^\/]+\.(pdf|jpg|png|jpeg|docx|doc|gif|xsl)/g
const REGEX_FILE_SRC_RELATIVE = /(href|src)\="\/.+(pdf|jpg|png|jpeg|docx|doc|gif|xsl)"/g
const REGEX_FILE_SRC_HARDCODED = new RegExp(
    `(href|src)="${domain}.+(pdf|jpg|png|jpeg|docx|doc|gif|xsl)"`,
    "g"
)

const getFiles = () => {
    files = [...files, ...(input.match(REGEX_FILE_SRC_RELATIVE) ?? [])]
    files = [...files, ...(input.match(REGEX_FILE_SRC_HARDCODED) ?? [])]
}

const createDownloadablePaths = () => {
    absolutePaths = files.map((file) => {
        return file
            .replace(`href="/`, `${domain}/`)
            .replace('href="', "")
            .replace(`src="/`, `${domain}/`)
            .replace('src="', "")
            .replace('"', "")
    })
}

const createNewHtmlWithRelativePaths = (appendedPath = "") => {
    const fileNames = files.map((file) => file.match(REGEX_FILE_NAME))
    let output = input
    for (const [index, name] of fileNames.entries()) {
        const fileRef = files[index].includes("href") ? "href" : "src"
        const newPath = `${fileRef}="${newRelativePath + appendedPath + name}"`
        output = output.replace(files[index], newPath)
        console.log(`New path: ${newPath}`)
    }
    fs.writeFileSync("../output.html", output)
}

const stripInlineStyles = (standAlone = false) => {
    const REGEX_INLINE_STYLE = /style=".+"/g
    const REGEX_ID = /id=".+"/g
    const REGEX_CLASS = /class=".+"/g
    let output =
        standAlone === false
            ? fs
                  .readFileSync("../output.html", "utf-8")
                  .replaceAll(REGEX_INLINE_STYLE, "")
                  .replaceAll(REGEX_CLASS, "")
                  .replaceAll(REGEX_ID, "")
            : fs
                  .readFileSync("../input.html", "utf-8")
                  .replaceAll(REGEX_INLINE_STYLE, "")
                  .replaceAll(REGEX_CLASS, "")
                  .replaceAll(REGEX_ID, "")
    fs.writeFileSync("../output.html", output)
}

const displayLinkedPages = () => {
    const REGEX_DOMAIN_CONTENT = new RegExp(`"${domain}\/.com\/"`, "g")
    let domainContent = input.match(REGEX_DOMAIN_CONTENT)?.map((link) => link.slice(1, link.length - 1)) ?? []
    domainContent = domainContent.filter((link) => (link, !files.includes(`href="${link}"`)))
    if (domainContent.length > 0) console.log("Linked Pages: ", domainContent)
}

const downloadFiles = async () => {
    const downloadLinks = Array.from(new Set(absolutePaths.map((path) => path.replace(/\s/g, "%20")))) // For URL parsing

    // Clear Downloads Folder
    if (fs.existsSync(`${downloadsDirectory}`)) await exec(`rm -r ${downloadsDirectory}`)

    // For Each Downloadable Link, attempt to download the File
    for (const link of downloadLinks) {
        try {
            await exec(`wget ${link} -P ${downloadsDirectory}`)
            console.log(`Downloaded: ${link}`)
        } catch {
            console.error(`Failed to download - ${link}`)
        }
    }

    if (!fs.existsSync(downloadsDirectory)) {
        console.log(`\nNothing to download on this page`)
        return
    }

    if (fs.existsSync(`/home/arodriguez/WSL/Downloads`)) {
        await exec(`rm -r /home/arodriguez/WSL/Downloads`)
    }

    try {
        await exec(`cp -r ${downloadsDirectory} /home/arodriguez/WSL`)
    } catch {
        console.log("WSL file doesnt exist")
    }
}

// Time stalling function
const wait = async (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

module.exports = {
    files,
    getFiles,
    downloadFiles,
    createDownloadablePaths,
    createNewHtmlWithRelativePaths,
    stripInlineStyles,
    displayLinkedPages,
    wait,
}
