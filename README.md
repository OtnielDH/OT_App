# OT App

This project is an overtime management application with a Django backend and a Vue.js frontend.

## Project Structure


## Backend

The backend is a Django application located in the `backend/` directory.

### Setup

1. Create a virtual environment:
    ```sh
    python -m venv venv
    ```

2. Activate the virtual environment:
    - On Windows:
        ```sh
        venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```sh
        source venv/bin/activate
        ```

3. Install the dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Run the migrations:
    ```sh
    python manage.py migrate
    ```

5. Start the development server:
    ```sh
    python manage.py runserver
    ```

### Database Setup

To set up the database, you can use the SQL scripts provided in the [DBcreation.txt](http://_vscodecontentref_/5) file.

### Export Overtime Requests

To export overtime requests to a JSON file, you can use the `export_to_json` method in the `OvertimeRequest` model.

## Frontend

The frontend is a Vue.js application located in the [frontend](http://_vscodecontentref_/6) directory.

### Project setup

1. Install the dependencies:
    ```sh
    npm install
    ```

2. Compiles and hot-reloads for development:
    ```sh
    npm run serve
    ```

3. Compiles and minifies for production:
    ```sh
    npm run build
    ```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Others

The [others](http://_vscodecontentref_/7) directory contains additional files such as Excel files and Perl scripts.

## License

This project is licensed under the MIT License.