const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chromeProfilePath = 'C:\\Users\\Boss\\AppData\\Local\\Google\\Chrome\\User Data\\Default';

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: chromePath,
        args: [
            `--user-data-dir=${chromeProfilePath}`,
            '--start-maximized',
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--disable-extensions',
            '--disable-dev-shm-usage',
        ],
    });

    try {
        const page = await browser.newPage();
        console.log("Opening YouTube page...");
        await page.goto('https://www.youtube.com/', { waitUntil: 'networkidle2' });

        // Debugging: Check if logged in
        const loggedIn = await page.evaluate(() => !!document.querySelector('#avatar-btn'));
        if (!loggedIn) {
            console.error("Not logged in! Check your profile path or login manually.");
            await browser.close();
            return;
        }
        console.log("Logged in with your existing profile.");
        console.log("The script will proceed after 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Navigate to Subscriptions page
        console.log("Navigating to the Subscriptions page...");
        await page.goto('https://www.youtube.com/feed/channels', { waitUntil: 'networkidle2' });

        // Check for "Subscribed" buttons
        const subscribedButtons = await page.$$('.yt-spec-touch-feedback-shape__fill');
        if (!subscribedButtons || subscribedButtons.length === 0) {
            console.log("No subscriptions found or Subscriptions page not loaded correctly.");
            await browser.close();
            return;
        }

        console.log(`Found ${subscribedButtons.length} subscriptions. Starting the unsubscription process...`);

        // Loop through and unsubscribe
        for (const button of subscribedButtons) {
            try {
                // Scroll to button
                await page.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), button);

                // Click button
                await button.click();
                console.log("Clicked on the 'Subscribed' button. Waiting for the dropdown...");

                // Wait for dropdown
                await page.waitForSelector('tp-yt-paper-item.style-scope.ytd-menu-service-item-renderer', { timeout: 5000 });

                // Locate and click "Unsubscribe"
                const unsubscribeButton = await page.evaluateHandle(() => {
                    const elements = [...document.querySelectorAll('tp-yt-paper-item.style-scope.ytd-menu-service-item-renderer')];
                    return elements.find(el => el.innerText.trim() === 'Unsubscribe');
                });

                if (unsubscribeButton) {
                    await unsubscribeButton.click();
                    console.log("Clicked 'Unsubscribe' in the dropdown menu.");
                } else {
                    console.warn("Unsubscribe button not found. Skipping this channel.");
                    continue;
                }

                // Wait for confirmation
                await page.waitForSelector('#confirm-button', { timeout: 5000 });
                const confirmButton = await page.$('#confirm-button');
                if (confirmButton) {
                    await confirmButton.click();
                    console.log("Confirmed unsubscription.");
                } else {
                    console.warn("Confirmation button not found. Skipping this channel.");
                }

                // Wait between actions
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error("Error unsubscribing from a channel:", error.message);
            }
        }

        console.log('All subscriptions removed successfully!');
    } catch (error) {
        console.error("An error occurred:", error.message);
    } finally {
        await browser.close();
    }
})();
