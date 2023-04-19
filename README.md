function (doc) {
emit(doc.\_id, 1);
emit(doc.email,1);
emit(doc.name, 1);
emit(doc.age, 1);
}

<!-- selector and fields -->

- selection of key in any document i.e. email, name, username
- useful cases -> $gt, $lt, $eq, $regex
- more queries -> https://dev.to/yenyih/query-in-apache-couchdb-mango-query-lfd
