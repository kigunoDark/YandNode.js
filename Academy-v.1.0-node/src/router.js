const express = require('express');
const db = require("./database.js");

const router = express.Router();

router.get("/api/articles", (req, res, next) => {
    const sql = "select * from article";
    // Для чего использован массив params? Есть ли в нем необходимость?
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(403).json({"error":err.message});
          return;
        }
        res.json({
            "message":"Успешно",
            "data":rows
        })
      });
});

router.get("/api/article/:id", (req, res, next) => {
    const sql = `select * from article where id = ${req.params.id}`;
    const params = [];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(403).json({"error":err.message});
          return;
        }
        /* Console.log используют для тестирования,
        так-как json уже выводит для нас всю нужную информаицю
        и все работает, его можно убрать. Можно их убрать и в 
        дальнейших запросах */

        console.log('row: ', row);
        res.json({
           //Сообщение лучше конкретизировать - успешно, что?
            "message":"Успешно",
            "data":row
        });
      });
});



/* {POST} Не критично, но "/" в конце запроса когда нет продолжения не обязателен.
Также в функции промежуточной обработки запрашивается next, который нигде 
не используется. Next -  дает доступ к следующей промежуточной функции обработки,
в случае если текущая функция не завершает цикл и может зависнуть. В данном примере 
и последующих, функция не зависает, поэтому - next - будет лишним
*/
router.post("/api/article/", (req, res, next) => {
    const errors=[];
    // Условный оператор который можно записать в одну строку Пример: ' if (!req.body.title) errors.push("title обязательно");'
    // Также можно использовать дополнительные пакеты валидации, чтобы избежать данный фрагмент кода тут.
    if (!req.body.title){
        errors.push("title обязательно");
    }
    if (!req.body.body){
        errors.push("body обязателен");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    /* Запрос работает, но есть недочеты. Нет валидации на поле Date.
    Можно вводить любую строку. Если это не предусмотрено добавлением 
    автоматически, то стоит сделать валидацию, или записывать в поле 
    при создании время создания которое конвертируется в строку */
    const data = {
        title: req.body.title,
        body: req.body.body,
        date: req.body.date
    };
    const sql ='INSERT INTO article (title, body, date) VALUES (?,?,?)';
    const params =[data.title, data.body, data.date];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(403).json({"error": err.message});
            return;
        }
        res.json({
            /* Сообщение лучше конкретезировать - успешно, что?
            Отредактировать везде */
            "message": "Успешно",
            "data": data,
            "id" : this.lastID
        });
    });
});

/* {PUT} -Put метод используется в случае, если необходимо обновить все данные.
В данном случае мы обновляем только (title and body), поэтому лучше использовать
метод PATCH */
router.put("/api/article/:id", (req, res, next) => {
    /* Можно без этого блока кода. Полей не так много
    поэтому можно запросить напрямую, а наша функция станет меньше
    и все читабельно */
    const data = {
        title: req.body.title,
        body: req.body.body
    };

    // Логи используют в основном для тестирования, их желательно убирать когда проект готов
    console.log(data);

    /* Не критично, но если в дальнейшем статья отображается с содержимым,
    заголовком и датой создания, то лучше обновлять поле даты или сделать поле
    обновления даты updatedDate, для того, чтобы на сайте или в приложении это контролировалось
    и отображалось пользователю. Если обновляем поле date то использовать метод PUT 
    так-как обновляются все данные. Если добавляем еще одно поле updatedAt, то лучше
    использовать PATCH метод, так-как поле (date) останется неизменным */ 
    db.run(
        `UPDATE article set 
           title = COALESCE(?,title),
           body = COALESCE(?,body)
           WHERE id = ?`,
        [data.title, data.body, req.params.id],
        // Аргумент result не задействован, его наличие не имеет смысла 
        (err, result) => {
            if (err){
                console.log(err);
                res.status(403).json({"error": res.message});
                return;
            }
            res.json({
                //Сообщение лучше конкретезировать - успешно, что?
                message: "Успешно",
                data: data
            });
    });
});

router.delete("/api/article/:id", (req, res, next) => {
    db.run(
        'DELETE FROM article WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                /* Ошибка 403 подразумевает ссобой, что доступ запрещен 
                или возникли трудности с доступом к серверу. В данном случае ошибка
                удаления может возникнуть в случае того, что запись с данным id не существует.
                Ошибка может случится если запись не найдена, я бы рекомендоват использовать
                404 - not found */
                res.status(403).json({"error": res.message});
                return;
            }

            res.json({"message":"Удалено", rows: this.changes});
    });
});

/* Обычно "/" используется, как тэг для главной страницы,
 куда переходит пользователь при вводе ссылки. Использовать данный тэг
в качестве вывода непонятноего сообщения не соввсем корректно. В проекте
уже заданы свои маршруты и не используется функция "res.redirect", то необходимости 
в использовании данного фрагмента кода нет. Если есть желание оставить данный маршурт
то можно в качестве сообщения вывести все маршруты по которым может обратиться пользователь, 
в Readme.file, и использовать данный фрагмент кода, как временную инструкцию.*/
// Если никуда не попали 
router.get("/", (req, res, next) => {
     /* Данный вид сообщения не несет в себе информатичной значимости
       В данноv случая при переходе на страницу, не понятно, что делать дальше. */
    res.json({"message":"Ok"});

});

module.exports = router;


// В package.js and gitignore - в целом вроде все хорошо