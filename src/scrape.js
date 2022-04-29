const fs = require("fs")
const puppeteer = require("puppeteer")
const { new_old_domain, username, password, downloadsDirectory } = require("./config")

const uploadDocumentsToCyberschool = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const login = async () => {
        await page.goto(new_old_domain)
        await page.click(
            "#topPagerBar > div > div.col-xs-12.col-md-6.col-lg-6.topPagerBarRight > div:nth-child(2) > a"
        )
        await page.waitForNetworkIdle()
        await page.type("#username", username, { delay: 100 })
        await page.type("#pwd", password, { delay: 100 })
        // Submit Login
        await Promise.all([
            page.click("#userLogin > div > div > div.modal-body > form > button"),
            page.waitForNavigation(),
        ])
    }

    const uploadDocuments = async () => {
        // My Files
        await page.waitForSelector("#quickBottomNav > ul > li:nth-child(7) > a")
        await page.click("#quickBottomNav > ul > li:nth-child(7) > a")
        // File Manager
        await page.waitForNetworkIdle()
        await page.click(
            "#modernMyExplorer > div > div > div.modal-body > div > div:nth-child(1) > div > ul > li:nth-child(2) > a"
        )
        // Public
        await page.waitForNetworkIdle()
        await page.click(
            "#myExplorerFileManager > div:nth-child(2) > div.col-sm-4 > nav > ul > li:nth-child(1) > a.loadFiles"
        )
        // Upload Btn		await page.click('#myExplorerFileManagerUpload')
        await page.click("#myExplorerCropperUploadButton")
        // Drop Files
        await page.waitForSelector("#myExplorerFileManagerUpload")

        // Clicks to trigger file uploader and waits for both promises to be fulfilled before uploading files
        const uploadFile = async (filePath) => {
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click("#myExplorerFileManagerUpload"),
            ])
            await fileChooser.accept([filePath])
        }

        const filePaths = fs.readdirSync(downloadsDirectory).map((file) => `${downloadsDirectory}/${file}`)

        for (const filepath of filePaths) {
            await uploadFile(filepath)
            await page.waitForNetworkIdle()
        }
        console.log(`Uploaded files to ${new_old_domain}`)
    }

    await login()
    await uploadDocuments()
    await browser.close()
}

module.exports = {
    uploadDocumentsToCyberschool,
}
