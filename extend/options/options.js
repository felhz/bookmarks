import { Copy, Request } from '../utils/index.js';
import Bookmarks from './bookmarks.js';

// 导入按钮
const importBtn = document.querySelector('#import-btn');
// 导入预览容器
const importPreviewEl = document.querySelector('#import-preview');
// 导入输入框
const importInputEl = document.querySelector('#import-input');
// 分享列表容器
const containerEl = document.querySelector('#share-container');

const Options = {
  init() {
    Bookmarks.init();
    this.getShareList();
    this.bindEvent();
  },
  bindEvent() {
    importBtn.addEventListener('click', () => {
      const value = importInputEl.value.trim();
      if (!value || !/^\d+$/.test(value) || value.length !== 13) {
        alert('请输入合法的id，点击已分享id分享获取');
        return;
      }
      Request(`/api/link/${value}`).then(async (res) => {
        Bookmarks.render(importPreviewEl, res.data, true);
        await createBookmark(res.data, '1');
      });
    });
    importInputEl.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        importBtn.click();
      }
    });
    importInputEl.addEventListener('input', (e) => {
      const value = e.target.value.trim();
      if (!value || !/^\d+$/.test(value) || value.length !== 13) {
        importPreviewEl.innerHTML = '';
        return;
      }
      console.log(e.target);
      Request(`/api/link/${value}`).then(async (res) => {
        Bookmarks.render(importPreviewEl, res.data, true);
        Bookmarks.bindEvent(importPreviewEl);
      });
    });

    const createBookmark = async (data, parentId) => {
      data.parentId = parentId;
      const res = await chrome.bookmarks.create({
        title: data.title,
        url: data.url,
        parentId: data.parentId,
      });
      if (data.children) {
        data.children.forEach(async (item) => {
          createBookmark(item, res.id);
        });
      }
    };
  },
  getShareList: async () => {
    const res = await Request('/api/share/list');
    if (res.data.length === 0) {
      containerEl.innerHTML = '暂无分享';
      return;
    }
    Options.renderShareList(res.data);
  },
  renderShareList(data) {
    containerEl.innerHTML = '';
    data.forEach((bookmarks) => {
      const div = document.createElement('div');
      const bookmarksListEl = document.createElement('div');
      const titleEl = document.createElement('h6');
      titleEl.innerText = 'id：' + bookmarks.id;
      titleEl.onclick = () => {
        Copy(bookmarks.id);
        importInputEl.value = bookmarks.id;
        // 触发事件
        const event = new Event('input');
        importInputEl.dispatchEvent(event);
      };
      div.appendChild(titleEl);
      div.appendChild(bookmarksListEl);
      containerEl.appendChild(div);
      Bookmarks.render(
        bookmarksListEl,
        {
          title: 'root',
          id: '0',
          children: [bookmarks.data],
        },
        true
      );
      Bookmarks.bindEvent(bookmarksListEl);
    });
  },
};

Options.init();
// setInterval(() => {
//   getShareList();
// }, 1000);
