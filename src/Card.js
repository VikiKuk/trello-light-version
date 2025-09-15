export default class Card {
  constructor(data, colId, board) {
    this.id = data.id;
    this.text = data.text;
    this.colId = colId;   // строковый id колонки
    this.board = board;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card';

    const content = document.createElement('div');
    content.textContent = this.text;

    const del = document.createElement('span');
    del.textContent = '✕';
    del.className = 'card-remove';

    // Удаление карточки
    del.onclick = (e) => {
      e.stopPropagation();  // предотвращение всплытия
      this.board.state[this.colId] = this.board.state[this.colId].filter(
        c => c.id !== this.id
      );
      this.board.save();
      this.board.render();
    };

    card.append(content, del);

    // drag’n’drop
    card.addEventListener('mousedown', e => {
      if (e.target.classList.contains('card-remove')) {
        return; // клик по X - drag не запускается
      }
      this.board.startDrag(e, this, card);
    });

    return card;
  }
}