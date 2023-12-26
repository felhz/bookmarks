console.log('content-script.js');
const ENV_CONFIG = {
  DEV: '13',
  TEST: '14',
  IM: 'im',
};

const IS_DEV = window.location.href.includes(ENV_CONFIG.DEV);
const IS_TEST = window.location.href.includes(ENV_CONFIG.TEST);
const IS_IM =
  window.location.href.includes(ENV_CONFIG.IM) && !IS_DEV && !IS_TEST;

let CURRENT_ENV = ENV_CONFIG.DEV;
if (IS_DEV) {
  CURRENT_ENV = ENV_CONFIG.DEV;
}
if (IS_TEST) {
  CURRENT_ENV = ENV_CONFIG.TEST;
}
if (IS_IM) {
  CURRENT_ENV = ENV_CONFIG.IM;
}
if (!window.location.href.includes('eeo')) CURRENT_ENV = '';

const NACOS_CONFIG = {
  [ENV_CONFIG.DEV]: {
    name: 'nacos(dev)',
    url: 'https://confcenter-lab.eeo-inc.com/nacos/',
  },
  [ENV_CONFIG.TEST]: {
    name: 'nacos(test)',
    url: 'https://confcenter-lab.eeo-inc.com/nacos/',
  },
  [ENV_CONFIG.IM]: {
    name: 'nacos(im)',
    url: 'https://confcenter-lab.eeo-inc.com/nacos/',
  },
};

const JENKINS_CONFIG = {
  [ENV_CONFIG.DEV]: {
    name: 'jenkins(dev)',
    url: 'https://webjks-lab.eeo-inc.com/job/k8_fe/job/fe_common_tmpl/build?delay=0sec',
  },
  [ENV_CONFIG.TEST]: {
    name: 'jenkins(test)',
    url: 'https://webjks-lab.eeo-inc.com/job/k8_fe/job/fe_common_tmpl/build?delay=0sec',
  },
  [ENV_CONFIG.IM]: {
    name: 'jenkins(im)',
    url: 'https://webjks-pre.eeo-inc.com/job/k8_fe/job/fe_common_tmpl/build?delay=0sec',
  },
};
const AYENA_CONFIG = {
  [ENV_CONFIG.DEV]: {
    name: 'ayena(dev)',
    url: 'https://ayena-test-k8s.eeo-inc.com/',
  },
  [ENV_CONFIG.TEST]: {
    name: 'ayena(test)',
    url: 'https://ayena-test-k8s.eeo-inc.com/',
  },
  [ENV_CONFIG.IM]: {
    name: 'ayena(im)',
    url: 'https://ayena-pre-k8s.eeo-inc.com/',
  },
};

const renderTooltip = () => {
  document.querySelectorAll('.chrome-tooltip').forEach((item) => {
    item.remove();
  });
  let configHtml = '<div ><button class="hide-btn">隐藏 </button></div>';
  if (CURRENT_ENV) {
    const CURRENT_NACOS = NACOS_CONFIG[CURRENT_ENV];
    configHtml += `<div id="nacos" class="">
                ${`<a target="_blank" href="${CURRENT_NACOS.url}" target="_blank">${CURRENT_NACOS.name}</a>`}
                </div>`;
    const CURRENT_JENKINS = JENKINS_CONFIG[CURRENT_ENV];
    configHtml += `<div id="jenkins" class="">
                ${`<a target="_blank" href="${CURRENT_JENKINS.url}" target="_blank">${CURRENT_JENKINS.name}</a>`}
                </div>`;
    const CURRENT_AYENA = AYENA_CONFIG[CURRENT_ENV];
    configHtml += `<div id="jenkins" class="">
                ${`<a target="_blank" href="${CURRENT_AYENA.url}" target="_blank">${CURRENT_AYENA.name}</a>`}
                </div>`;
    configHtml += `<div id="hub" class="">
                ${`<a target="_blank" href="https://registry.eeo-inc.com/" target="_blank">镜像仓库</a>`}
                </div>`;
    configHtml += `<div  class="">
                ${`<a target="_blank" href="https://js-lab.eeo-inc.com/core/auth/login/" target="_blank">堡垒机</a>`}
                </div>`;
  }

  let html = `<div class="chrome-tooltip">${configHtml}</div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.querySelector('.hide-btn').addEventListener('click', () => {
    document.querySelector('.chrome-tooltip').remove();
  });
};

chrome.runtime.onMessage.addListener(function (sender, sendResponse) {
  if (CURRENT_ENV == '') {
    alert('当前环境不是eeo环境，无法使用该插件');
    return;
  }
  console.log(sender);
  renderTooltip();
  sendResponse({ farewell: 'goodbye' });
});
