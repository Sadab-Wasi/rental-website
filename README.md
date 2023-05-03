# Rental Website

This application allows a user to view the rental shop. Browse items throughout the shop. Order items by adding to cart. And can also view the order history of all putchases.  
<br /><br />

## Application Tools

---

1.  Uses expressJS for routing abd launching web application.
2.  Uses engine ejs for HTML template rendering.
3.  Uses HTML, CSS, JS, Jquery, Bootstrap JS, Notify JS, Font awesome, Google web-font.
4.  Uses Sequelize to comminucate with Postgres SQL.

<br /><br />

## Application Workflow

---

1.  Applications launches with NodeJS.
2.  On start, the application creates a new tables & initial data in PostgresSQL database, using Sequalize.
3.  And launches the web application, using expressJS.
4.  Multiple web templates and components are created using engine ejs. When ever a user access a page, the components are combined to make teh required page dynamically.
5.  Adding cart, purchasing items, creating items, order history are all recorded in postgres database.
6.  Data information is accessed and manipulated form the Posegres database using sequalize as middleware.

<br /><br />

## Application setup

---

1.  Make sure you have the following applications installed
    - NodeJS version 18.15.0 was used
    - PostgresSql version 12.0 was used
2.  Enter "/src" folder, create a file named ".env" and enter the following information:

    - ```shell
        # Web client
        HOST = 'localhost'
        PORT = '3000'

        # Database config
        DB_NAME = "database_name"
        DB_USER = "user_name"
        DB_PASS = "password"
        DB_HOST = "localhost"
        DB_PORT = "5432"

        DB_RESET = "TRUE"
      ```

    - The "`Database config`" is based on your postgres setup requirements.
    - The "`DB_RESET`" set to True means everytime the app starts, the whole db is set to be a clean startup. Setting it to False will keep the database saved according to the user edits. Recomended to set it True for the first time, then False later.

3.  Open terminal and run "`npm install`" to install all required packages.

<br /><br />

## Application usage

---

1. Open terminal and run "`npm start`" to start the application server.
2. Open any browser (recomended Chrome), and type "`http://localhost:4000/`" in address bar.
3. Browse through the web application, add items to the cart, purchase items and check order history.
4. Can also access admin interface to add new products or delete old products to make adjustments to the web application.
