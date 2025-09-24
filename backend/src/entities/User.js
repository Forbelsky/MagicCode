// entities/User.js
class User {
  constructor({ id, username, name, roles = [], passwordHash }) {
    this.id = id
    this.username = username
    this.name = name
    this.roles = roles
    this.passwordHash = passwordHash // uložený hash hesla (ne posílat na klienta)
  }

  toPublicJSON() {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      roles: this.roles,
    }
  }
}

module.exports = { User }
