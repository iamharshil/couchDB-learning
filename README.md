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
- https://readthedocs.org/ - multiple queries
- https://github.com/1999/node-couchdb/blob/master/src/node-couchdb.js (node-couchdb code)
- https://futurestud.io/tutorials/node-js-check-if-a-file-exists (node fs)

<!-- methods -->

```js

// Database
- createDatabase("db name")
- dropDatabase("db name")
- listDatabases()

// documents
- insert("db name", {...} )
- del("db name","id","rev-id",);
- get("db name", "view path")
- update("db name", {_id: "id",_rev: "rev id", ...});
- mango("db name", query);

// Attachment
- insertAttachment("db name", "attachment name", "attachment body", "doc revision")
// remove attachment
- update("db name", "doc id", "attachment name", "doc revision")
// delete attachment (remove not working)
.delAttachment("db name","_id","attachment name","_rev")
```

- image
- (view || design for get) - view for update
- multer image on no profile changes
- how to get rev on update(frontend)
- update doc removes other fields too (save older data with updated data)
