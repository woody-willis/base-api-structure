
# Express & MySQL API Base

Simple and robust Express API structure with MySQL connection and migrations for my projects.


## Installation

- Install [NodeJS](https://nodejs.org/en)
- Install [MySQL](https://www.mysql.com/)

```bash
  cd path-to-api/
  npm install

  mysql -u root -p < schema.sql
  # Edit .env with username and password from schema.sql
  npm run migrate

  # Edit routes/controllers/classes
  npm run dev/npm start
```