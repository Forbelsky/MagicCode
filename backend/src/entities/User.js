// entities/User.js
class User {
  constructor({ id, username, password_hash }) {
    this.id = id;
    this.username = username;
    // v DB se většinou jmenuje password_hash → namapujeme ho
    this.passwordHash = password_hash;
  }

  // veřejná data pro frontend – bez hesla!
  toPublicJSON() {
    return {
      id: this.id,
      username: this.username,
    };
  }
}

export default User;
