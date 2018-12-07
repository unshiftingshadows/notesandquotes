"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const defaultApp = admin.initializeApp(functions.config().firebase);
exports.firestore = defaultApp.firestore();
const settings = { timestampsInSnapshots: true };
exports.firestore.settings(settings);
exports.auth = defaultApp.auth();
//# sourceMappingURL=index.js.map