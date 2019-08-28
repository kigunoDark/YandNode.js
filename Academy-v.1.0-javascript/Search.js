class Search extends Component {
  constructor() {
    super();
    this._onChange = null;
  }

  get template() {
    /* Не совсем понятно зачем используется функция 'trim',
     которая удаляет все пробелы в строке. */
    return `<input type="text" name="search" placeholder="Search">
      <button type="submit" class="visually-hidden">Search</button>`.trim();
  }

  
  removeEventListener() {
    // В одну строчку понятнее
    this._element
      .removeEventListener(`keydown`, this._onSearchChange);
  }

  _onSearchChange(event) {
    if (typeof this._onChange === `function`) {
      this._onChange(event.target.value);
    }
  }
  set onChange(fn) {
    this._onChange = fn;
  }

  setEventListener() {
    //В одну строчку понятнее
    this._element
      .addEventListener(`keyup`, this._onSearchChange);
  }

}


/*Сама функция не работает, так еще при нажатии поиска открывает файловую систему диска.
Задача не реализована, я не могу искать нужным в списке мне людей. Вероятнее всего к кнопке 
не приязано никакое событие.*/