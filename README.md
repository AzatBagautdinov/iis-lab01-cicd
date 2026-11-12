# ЛР №1: Git и CI/CD, вариант 3

[![CI](https://github.com/AzatBagautdinov/iis-lab01-cicd/actions/workflows/ci.yml/badge.svg)](https://github.com/AzatBagautdinov/iis-lab01-cicd/actions/workflows/ci.yml)

Учебный конвертер валют на JavaScript и Node.js. Курсы фиксированные и вымышленные: 1 USD = 90 RUB, 1 EUR = 100 RUB. Это демонстрация алгоритма и CI/CD, а не источник котировок.

## Установка и проверка

Требуется Node.js 22 или 24 и npm.

```sh
npm ci
npm run lint
npm run test:coverage
npm run build
npm start
```

API слушает `http://127.0.0.1:3101`. История хранится в памяти процесса; после перезапуска она пуста. Суммы округляются до двух знаков; формула: `amount * rate[from] / rate[to]`.

| Метод | Путь | Назначение |
|---|---|---|
| GET | `/health` | Проверка процесса |
| GET | `/rates` | Фиксированные учебные курсы |
| POST | `/convert` | JSON: `amount`, `from`, `to` |
| GET | `/history` | История вычислений |

Валидируются тип, конечность и диапазон суммы, поддерживаемые валюты, JSON и размер тела. Неизвестный маршрут возвращает 404.

```sh
curl -H 'Content-Type: application/json' -d '{"amount":2,"from":"USD","to":"RUB"}' http://127.0.0.1:3101/convert
```

В Windows PowerShell используйте `curl.exe` либо `Invoke-RestMethod`.

## Docker

```sh
docker build --target test -t iis-lab1:test .
docker build --target production -t iis-lab1:v1 .
docker run --rm -p 127.0.0.1:3101:3101 iis-lab1:v1
```

Финальный образ запускается от пользователя `node` и не содержит devDependencies. Стадия `test` действительно запускает линтер, Jest и сборку.

## CI/CD и защита

Workflow проверяет Node.js 22/24, покрытие, сборку, аудит и Docker. Образ публикуется в GHCR только после успешных проверок при push в main. На PR публикация не запускается.

Для демонстрации:

1. Покажите `git log --graph --oneline --all` и feature/hotfix-ветки.
2. Объясните сохранённые в истории `stash`, `cherry-pick`, `rebase`, merge-коммиты и разрешение конфликта.
3. Запустите тесты и покажите отрицательные проверки входных данных.
4. Откройте Actions и Pull Request с намеренно неверным тестом, затем его исправление.
5. Запустите production-контейнер и выполните конвертацию.

Локальные измерения, отчёт и материалы для защиты хранятся отдельно от публикуемого проекта. Публичный репозиторий не содержит PDF заданий и личных данных титульного листа.
