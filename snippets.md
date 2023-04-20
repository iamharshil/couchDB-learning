```json
{
  // javascript
  // Place your snippets for javascript here. Each snippet is defined under a snippet name and has a prefix, body and
  // description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
  // $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the
  // same ids are connected.
  // Example:
  // "Print to console": {
  // 	"prefix": "log",
  // 	"body": [
  // 		"console.log('$1');",
  // 		"$2"
  // 	],
  // 	"description": "Log output to console"
  // }
  "console log": {
    "prefix": "cnl, cnlg, clg, log",
    "body": "console.log($0)",
    "description": "console log snippet"
  },
  "tce": {
    "prefix": "tce, tc, apiTc, tcError",
    "body": "try {\n\t$0\n} catch (error) {\n\tconsole.log(error);\nreturn res.status(500).json({ status: 500, message: \"Internal server error.\", error });\n}",
    "description": "Try catch api error"
  },
  "res202": {
    "prefix": "res202, res 202",
    "body": "return res.status(202).json({ status: 202, message: \"success\", data: $0 });",
    "description": ""
  },
  "res201": {
    "prefix": "res201, res 201",
    "body": "return res.status(201).json({ status: 201, message: \"success\" });",
    "description": ""
  },
  "res400": {
    "prefix": "res400, res 400",
    "body": "return res.status(400).json({ status: 400, message: \"Something went wrong.\" });",
    "description": ""
  },
  "res405": {
    "prefix": "res405, res 405",
    "body": "return res.status(405).json({ status: 405, message: \"Method not allowed.\" });",
    "description": ""
  },
  "exphandler": {
    "prefix": "export handler",
    "body": "export default async function handler(req,res) {\n\t$0\n}",
    "description": ""
  }
}
```

```json
{
  // javascript react
  // Place your snippets for javascriptreact here. Each snippet is defined under a snippet name and has a prefix, body and
  // description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
  // $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the
  // same ids are connected.
  // Example:
  // "Print to console": {
  // 	"prefix": "log",
  // 	"body": [
  // 		"console.log('$1');",
  // 		"$2"
  // 	],
  // 	"description": "Log output to console"
  // }
  "console log": {
    "prefix": "clg cnlg clog",
    "body": "console.log($0)",
    "description": "Log output to console"
  },
  "tce": {
    "prefix": "tce, tc, apiTc, tcError",
    "body": "try {\n\t$0\n} catch (error) {\n\n\treturn res.status(500)\n.json({ status: 500, message: \"Internal server error.\", error });\n};",
    "description": "Try catch api error"
  }
}
```
