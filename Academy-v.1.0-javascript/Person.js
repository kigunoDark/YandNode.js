class Person extends Component {
    constructor(name) {
        super();
        this.name = name;
        this._happiness = 0;
        this._valueElement = document.querySelector(`.column__value-name`);
        this._iconElement = document.querySelector(`.column__value-icon`);
    }

    hasCat() {
        return this._happiness++;
    }

    hasRest() {
        return this._happiness++;
    }

    hasMoney() {
        return this._happiness++;
    }

    isSunny() {

        //Константы лучше объявлять заглавными буквами, это же константы.
        const APIKey = '28c7d687accc7c75aabbc7fb71173feb';
        const city = 'Москва';
        const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;

        /*Нет проверки на ошибку, не предусмотренно. А что если ссылка 
        повреждена или мы дае возможность пользователю ввести город, он ввел его не верно
        тогда запрос не сработает и мы должны предусмотреть этот момент*/ 
        return fetch(url)
            /* res - часто используется в node.js платформе.
            Чтобы не было путаницы я бы назвал просто data */
            .then(res => res.json())
            .then((res) => {
              //Логирование лучше убирать, его используют для тестирования
              console.log(res)
              /* Казалось бы, что это не большое условие, его можно организовать в одну строку
               if (res.main.temp - 273 > 15)return this._happiness++;, однако
               оно не работает. Причина в том, что дожен быть 'else'. Если температура больше
               15 - то к переменной прибавляется еще единица и ее возвращает, а если нет, то
               то нам ничего не вернется. Поэтому наш смайлик всегда грустный. */

                if ((res.main.temp - 273) > 15) {
                    return this._happiness++;
                }
            });
      }
}


/* В данном блоке кода с виду все хорошо, однако на странице не важно, что я выбираю
все равно смайлик грустный. Есть у меня деньги или нет, отдыхал я или нет, не имеет значения. 
Нигде не вызываются функции (hasCat, hasRest, hasMoney) и поэтому наш пользователь в постоянной 
депрессии*/