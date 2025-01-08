# YouTube Unsubscription Automation Script

This script automates the process of unsubscribing from YouTube channels using Puppeteer. It navigates to your YouTube subscriptions page and unsubscribes from all channels listed.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Chrome installed

## Setup

1. **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Update the script:**

    Open [script.js](http://_vscodecontentref_/0) and update the following paths to match your system:

    ```javascript
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chromeProfilePath = 'C:\\Users\\Your User Name\\AppData\\Local\\Google\\Chrome\\User Data\\Default';
    ```

## Usage

1. **Run the script:**

    ```sh
    node script.js
    ```

2. **Script behavior:**

    - The script will launch Chrome with your user profile.
    - It will navigate to YouTube and check if you are logged in.
    - If logged in, it will navigate to the subscriptions page.
    - It will find all "Subscribed" buttons and click them to open the dropdown menu.
    - It will click the "Unsubscribe" option in the dropdown menu.
    - It will confirm the unsubscription if a confirmation dialog appears.
    - It will wait for 2 seconds between each unsubscription to avoid being flagged as a bot.

## Troubleshooting

- **Not logged in:**
    - Ensure the [chromeProfilePath](http://_vscodecontentref_/1) points to a valid Chrome user profile where you are logged in to YouTube.
    - Manually log in to YouTube using the specified profile path and try running the script again.

- **Elements not found:**
    - YouTube's UI may change over time, causing selectors to break. Update the selectors in the script if necessary.

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or find any bugs.

## License

This project is licensed under the MIT License.
