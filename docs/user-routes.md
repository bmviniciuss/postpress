# User Routes

## `POST /user`
- Should create a new user record on the database.
- Fields: 
```json
{
  "displayName": "",
  "email": "",
  "password": "",
  "image": ""
}
```
 - Validations:
  - `displayName` should be a string with at least 8 caracters
  - `email`: **Required** should be unique and valid.
  - `password`: **Required** at leat 7 carachters.
 - Returns:
   - Existing email: `"message": "Usuário já existe"`
   - Ok (**201**): JWT Token.

