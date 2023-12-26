import { Copy, Request } from '../utils/index.js';

const Bookmarks = {
  booksListEl: document.querySelector('#bookmarks-list'),
  innerHTML: '',
  init() {
    chrome.bookmarks.getTree((e) => {
      const list = e[0];
      console.log(list);
      this.render(Bookmarks.booksListEl, list);
      this.bindEvent(Bookmarks.booksListEl);
    });
  },
  update() {
    chrome.bookmarks.getTree((e) => {
      const list = e[0];
      console.log(list);
      this.render(Bookmarks.booksListEl, list);
      this.bindEvent(Bookmarks.booksListEl);
    });
  },
  bindEvent(booksListEl) {
    // 分享事件
    booksListEl.querySelectorAll('.share-btn').forEach((item) => {
      item.addEventListener('click', (e) => {
        const info = JSON.parse(e.target.dataset.info);
        Request('/api/link', { data: info }, 'POST').then((res) => {
          console.log(res);
          Copy(res.data);
        });
      });
    });
    // 折叠事件
    booksListEl.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('accordion-button')) {
        const id = target.dataset.bsTarget;
        const collapseEl = booksListEl.querySelector(id);
        collapseEl.classList.toggle('show');
        target.classList.toggle('collapsed');
      }
    });
    // 删除事件
    booksListEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('del-btn')) {
        const info = JSON.parse(e.target.dataset.info);
        chrome.bookmarks.remove(info.id, () => {
          Bookmarks.update();
        });
      }
    });
  },
  render(booksListEl, list, preview = false, cb = () => {}) {
    Bookmarks.innerHTML = `<div class="accordion" id="accordionExample">`;
    Bookmarks.showBookmarks(list, preview);
    Bookmarks.innerHTML += '</div>';
    booksListEl.innerHTML = '';
    booksListEl.innerHTML = Bookmarks.innerHTML;
  },
  renderBookmark(data, preview) {
    return `<li class="list-group-item">
                        <div class="d-flex justify-content-between flex-nowrap">
                            <a  href="${data.url}}">${data.title}</a> 
                           ${
                             preview
                               ? ''
                               : `<div>
                                <button type="button" class="del-btn btn text-danger" data-info='${JSON.stringify(
                                  data
                                )}' >删除</button>
                                 <button type="button" class="share-btn btn text-primary" data-info='${JSON.stringify(
                                   data
                                 )}' >分享</button>
                                 </div>`
                           }
                        </div>
                    <li>`;
  },
  showBookmarks(list, preview) {
    if (!list.children) {
      Bookmarks.innerHTML += Bookmarks.renderBookmark(list, preview);
      return;
    }
    list.children.forEach((item, index) => {
      if (item.url) {
        Bookmarks.innerHTML += Bookmarks.renderBookmark(item, preview);
      } else {
        const id = 'item' + item.id;
        Bookmarks.innerHTML += `<div class="accordion-item">  
                        <h2 class="accordion-header">
                           <div class="container ">
                           <div class="row">
                              <h6 class="col">${item.title}</h6>
                              <div class="col-6">
                                  <div class="d-flex justify-content-end">
                                    ${
                                      !!item.children.length && !preview
                                        ? ` <button type="button" class="share-btn btn btn-primary" data-info='${JSON.stringify(
                                            item
                                          )}'>
                                      分享文件
                                    </button>`
                                        : ''
                                    }
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="true" aria-controls="collapseOne"> </button>
                                  </div>
                              </div>
                           </div>
                        </h2>
                        <div id="${id}" class="accordion-collapse collapse " data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                        
                            <ul class="list-group">`;
        item.children && Bookmarks.showBookmarks(item, preview);
        Bookmarks.innerHTML += `</ul>  
                    </div>
                    </div>`;
      }
    });
  },
};
export default Bookmarks;
