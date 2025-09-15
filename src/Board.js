import { loadState, saveState } from './storage.js';
import Column from './Column.js';

export default class Board {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = loadState();
    this.drag = null;
  }

  save() {
    saveState(this.state);
  }

  render() {
    this.container.innerHTML = '';

    const cols = [
      { id: 'todo', title: 'TODO' },
      { id: 'inprogress', title: 'IN PROGRESS' },
      { id: 'done', title: 'DONE' }
    ];

    for (const c of cols) {
      const column = new Column(c.id, c.title, this);
      this.container.append(column.render());
    }
  }

  startDrag(e, cardInstance, cardEl) {
    e.preventDefault();

    document.body.classList.add('dragging-cursor');

    const rect = cardEl.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const ghost = cardEl.cloneNode(true);
    ghost.classList.add('dragging');
    ghost.style.width = rect.width + 'px';
    ghost.style.left = rect.left + 'px';
    ghost.style.top = rect.top + 'px';
    document.body.append(ghost);

    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.style.height = rect.height + 'px';
    cardEl.replaceWith(placeholder);

    // сохраняем данные карточки
    this.drag = {
      id: cardInstance.id,
      text: cardInstance.text,
      oldCol: cardInstance.colId,
      ghost,
      placeholder,
      offsetX,
      offsetY
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp, { once: true });
  }

  onMouseMove(e) {
    if (!this.drag) return;

    this.drag.ghost.style.left = (e.clientX - this.drag.offsetX) + 'px';
    this.drag.ghost.style.top = (e.clientY - this.drag.offsetY) + 'px';

    const el = document.elementFromPoint(e.clientX, e.clientY);
    const column = el?.closest?.('.column');
    if (!column) return;

    const list = column.querySelector('.cards');
    const siblings = [...list.children];
    let before = null;

    for (const s of siblings) {
      const r = s.getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) {
        before = s;
        break;
      }
    }

    if (before) list.insertBefore(this.drag.placeholder, before);
    else list.append(this.drag.placeholder);
  }

  onMouseUp() {
    if (!this.drag) return;

    this.drag.ghost.remove();

    const columnEl = this.drag.placeholder.closest('.column');
    const newCol = columnEl.dataset.col;

    // удалить из старой колонки
    this.state[this.drag.oldCol] = this.state[this.drag.oldCol].filter(
      c => c.id !== this.drag.id
    );

    // вставить в новую колонку
    const idx = [...this.drag.placeholder.parentNode.children].indexOf(this.drag.placeholder);
    this.state[newCol].splice(idx, 0, { id: this.drag.id, text: this.drag.text });

    this.drag.placeholder.remove();
    this.drag = null;
    this.save();
    this.render();

    document.body.classList.remove('dragging-cursor');
  }
}