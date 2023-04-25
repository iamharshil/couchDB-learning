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
- !IMPORTANT https://docs.couchdb.org/en/stable/api/database/index.html
- https://dba.stackexchange.com/questions/240447/complex-queries-in-couchdb-across-multiple-documents
- multer multiple files -> https://stackoverflow.com/questions/36096805/uploading-multiple-files-with-multer-but-from-different-fields
- https://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis/

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

// sort, limit, skip, bookmark, execution_stats
```

- update doc removes other fields too (save older data with updated data)
- inter grated api of each other(get matched id while passing rev each other).
- create index for fields in doc and after that sort will works

<!-- this -->

- image
- view || design -> when, use cases
- (view || design for get) - view for multiple
- index
- bookmark
- multiple data lookup(alternative)

<!-- through url -->

- each takes url at front without credentials, each takes headers of "Content-Type": "application/json", post methods goes with json stringify
- `_session` -> POST name: username, password: password -> response with auth token.
- `_all_dbs` -> GET -> get all databases.
- `_dbs_info` -> POST, keys: ["multiple", "db", "names"] -> get database info of array.
- `dbName/_all_docs` -> GET -> get all id, key and value of all docs in db.
- `dbName` -> PUT -> creates new db.
- `dbName/_design_docs` -> GET -> gives all design docs. It has may queries.

  - conflicts(boolean) -> include conflicts information.
  - descending(boolean) -> return design doc on rev order
  - endKey (string) -> stop returning docs on specific field
  - endKey_docid (string) -> stops returning docs on specific doc id. | alias => end_key_doc_id
  - include_docs(boolean) -> includes full content of docs
  - key(string) -> return docs that match specified keys
  - keys(string) -> return specified docs that match keys
  - limit(number) -> limit returned doc size
  - skip -> skip number of docs.
  - startkey -> start records from specified key. | alias => start_key
  - startkey_docid -> start with specific doc id.
  - update_seq -> response includes update_seq

- index doctype (use index on most usable field)
- add bookmark in mango query, if skip is set in it then it will skip doc even after bookmarks are set. all other query remains the same otherwise result of bookmark will be different. if limit was 10 and now 20 then bookmark shows 20 afterwards. if selector is set before and not after then it will shows whole data even with bookmark, in case of no data left doc will be empty.
- startKey, endKey works based on particular field by $gte and $lte

```js
const options = {
  selector: {
    field1: {
      $gte: startKey,
      $lte: endKey
    }
  }
```

```js
// mango through bookmark

let allData = [];
async function getData(bookmark) {
  return await couchDB.mango(process.env.COUCH_DB_NAME, {
    selector: {
      doc_type: "product",
      status: "active",
    },
    limit: 1,
    bookmark,
  });
}
async function recurFunc(prevBookmark) {
  const temp = await getData(prevBookmark);
  if (temp.status === 200) {
    if (temp.data.docs.length > 0) {
      allData = [...allData, ...temp.data.docs];
      recurFunc(temp.data.bookmark);
    } else {
      return res.status(202).json({
        status: 202,
        ok: true,
        message: "success",
        data: allData,
      });
    }
  } else {
    console.log(temp);
    return res
      .status(400)
      .json({ status: 400, ok: false, message: temp.message });
  }
}
await recurFunc("");
```

mystore_user
mystore_product
mystore_order
