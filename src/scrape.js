const fs = require("fs")
const puppeteer = require("puppeteer")
const { cyberschool_domain, username, password, downloadsDirectory } = require("./config")
const { wait } = require("./helpers")

const createNavigationItem = async(label, type) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const login = async () => {
      await page.goto(cyberschool_domain)
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

}

const uploadDocumentsToCyberschool = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const login = async () => {
        await page.goto(cyberschool_domain)
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
        console.log(`Uploaded files to ${cyberschool_domain}`)
    }

    await login()
    await uploadDocuments()
    await browser.close()
}

const createCyberschoolPage = async (title, html) => {
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50, // slow down by 250ms
    })
    const page = await browser.newPage()
    const login = async () => {
        await page.goto(cyberschool_domain)
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

    const createPage = async () => {
        // Click +
        await page.click("#quickAddMenuDrop1")
        // Click Page
        await page.click(
            "#topPagerBar > div > div:nth-child(1) > div.btn-group.topPagerBarSearchBgGroup > div > div > div > ul > li:nth-child(1) > a"
        )
        // Add Title
        await page.type("#quickAddTitle", title)
        //  Create Page
        await page.click("#quickAddModal > div > form > div.modal-footer > input")
        // Click Edit
        await page.waitForNetworkIdle()
        await page.click(
            "#item_title_top > span > span.crumbMenu > span > span > span > a:nth-child(1) > span"
        )

        // Wait for textbox to load
        const selector = ""
        await page.waitForSelector(selector)
        await page.evaluate((selector) => {
            document.querySelector(selector).click()
        }, selector)
        // Paste source code (selector, html)
        const setSelectVal = async (sel, val) => {
            page.evaluate(
                (data) => {
                    return (document.querySelector(data.sel).value = data.val)
                },
                { sel, val }
            )
        }
        await setSelectVal("textarea", html)
        await wait(2000)
        // Publish Content
        await page.click("#ext-gen216")
        await wait(1000)
    }

    await login()
    await createPage()
    await browser.close()
}

module.exports = {
    createCyberschoolPage,
    uploadDocumentsToCyberschool,
}
