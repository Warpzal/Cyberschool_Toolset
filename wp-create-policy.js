const puppeteer = require('puppeteer')

const wait = async (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

const createPage = async (prefix, pageName) => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    // Login
    await page.goto('https://jeffersonparish.wp.iescentral.com/wp-login.php')
    await wait(1500)
    await page.type('#user_login', 'ies')
    await page.type('#user_pass', 'j4?qPD+?2%x8@yaMjQVE')
    await page.click('#wp-submit')
    await wait(1500)

    // Click Create New Page
    await page.goto(
        'https://jeffersonparish.wp.iescentral.com/wp-admin/post-new.php?post_type=page'
    )
    await wait(1500)
    // Selecting option from dropdown
    await page.select('#parent_id', '111')
    await page.type('#title', `${prefix} - ${pageName}`)

    // Click to add PDF -> Opens Media Library
    await page.click('.acf-button')
    await page.type('#media-search-input', prefix)
    // await page.click('#menu-item-upload')

    // await page.screenshot({ path: 'amazing.png' })
    // await browser.close()
}
// createPage('E', 'Technology and Internet Acceptable Use Contract')
// createPage('R', 'Technology and Internet Use Regulations')
createPage('MFB', 'Student Teachers')
