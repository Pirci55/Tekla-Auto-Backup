const Fs = require('fs');
const Path = require('path');
const Config = require('./nodemon.json');
const Now = new Date();
const
    year = Now.getFullYear(),
    month = Now.getMonth() + 1,
    day = Now.getDate(),
    hour = Now.getHours(),
    minute = Now.getMinutes(),
    second = Now.getSeconds();
const dirName = [
    year,
    (month) < 10 ? '0' + month : month,
    (day) < 10 ? '0' + day : day
].join('-') + ' ' + [
    (hour) < 10 ? '0' + hour : hour,
    (minute) < 10 ? '0' + minute : minute,
    (second) < 10 ? '0' + second : second,
].join('-');

function copyDir(src, dest) {
    try {
        // Создайте целевую директорию, если она не существует
        if (!Fs.existsSync(dest)) {
            Fs.mkdirSync(dest, { recursive: true });
        }

        // Прочитайте содержимое исходной директории
        const items = Fs.readdirSync(src, { withFileTypes: true });

        // Перебираем каждый элемент в исходной директории
        for (const item of items) {
            const srcPath = Path.join(src, item.name);
            const destPath = Path.join(dest, item.name);

            if (item.isDirectory()) {
                // Рекурсивно копируем поддиректории
                copyDir(srcPath, destPath);
            } else {
                // Копируем файлы
                Fs.copyFileSync(srcPath, destPath);
            }
        }
    } catch (error) {
        console.error(`Ошибка копирования: ${error.message}`);
    }
}

copyDir(Config.watch[0], Config.backup + '/' + dirName)
console.log(`Содержимое "${Config.watch[0]}" успешно скопировано в "${Config.backup}/${dirName}"`)
