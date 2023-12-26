document.querySelector('#go-to-options').addEventListener('click', function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const execJS = async (func, cb = () => {}) => {
  const tab = await getCurrentTab();
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      func: func,
    })
    .then((res) => {
      cb(res);
    });
};
document
  .querySelector('#show-config-btn')
  .addEventListener('click', async () => {
    const tab = await getCurrentTab();
    await chrome.tabs.sendMessage(tab.id, tab);
  });
