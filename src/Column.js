import Card from './Card.js';

export default class Column {
  constructor(id, title, board) {
    this.id = id;
    this.title = title;
    this.board = board;
  }

  addCard(text) {
    this.board.state[this.id].push({ id: crypto.randomUUID(), text });
  }

  removeCard(id) {
    this.board.state[this.id] = this.board.state[this.id].filter(c => c.id !== id);
  }

  render() {
    const colEl = document.createElement('div');
    colEl.className = 'column';
    colEl.dataset.col = this.id;

    const title = document.createElement('div');
    title.className = 'column-title';
    title.textContent = this.title;

    const list = document.createElement('div');
    list.className = 'cards';

    for (const cardData of this.board.state[this.id]) {
      const card = new Card(cardData, this.id, this.board); 
      list.append(card.render());
    }

    // Add card link
    const addLink = document.createElement('div');
    addLink.className = 'add-link';
    addLink.textContent = '+ Add another card';

    // Add card form
    const form = document.createElement('div');
    form.className = 'add-form hidden';
    form.innerHTML = `
      <textarea class="add-input" placeholder="Enter a task"></textarea>
      <div class="form-actions">
        <button class="add-btn">Add</button>
        <button class="cancel-btn">x</button>
      </div>
    `;

    addLink.onclick = () => {
      addLink.classList.add('hidden');
      form.classList.remove('hidden');
      form.querySelector('.add-input').focus();
    };

    form.querySelector('.add-btn').onclick = () => {
      const txt = form.querySelector('.add-input').value.trim();
      if (!txt) return;
      this.addCard(txt);
      this.board.save();
      this.board.render();
    };

    form.querySelector('.cancel-btn').onclick = () => {
      form.querySelector('.add-input').value = '';
      form.classList.add('hidden');
      addLink.classList.remove('hidden');
    };

    colEl.append(title, list, addLink, form);
    return colEl;
  }
}