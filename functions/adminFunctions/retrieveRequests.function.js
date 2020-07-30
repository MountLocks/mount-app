const admin = require("firebase-admin");
const functions = require("firebase-functions");

const db = admin.firestore();

module.exports.retrieveRequests = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      return { message: "Authentication Required!", code: 401 };
    }
    let userData = await db
      .collection("users")
      .doc(context.auth.uid)
      .get();
    if (userData.data().role !== "admin") {
      return {
        message: "You are not authorized to perform this action",
        code: 401
      };
    }
    if (userData.data().cityName && userData.data().role === "admin") {
      const requests = db
        .collection("approvals")
        .where("cityName", "==", userData.data().cityName);
      let reqData = await requests.get();
      let res = [];
      reqData.forEach(element => {
        res.push({
          toApprove: element.data().toApprove,
          userName: element.data().userName,
          cityName: element.data().cityName,
          companyName: element.data().companyName,
          rejected: element.data().rejected,
          requestID: element.id
        });
      });
      return res;
    } else if (
      userData.data().companyName &&
      userData.data().role === "admin"
    ) {
      const requests = db
        .collection("approvals")
        .where("companyName", "==", userData.data().companyName);
      let reqData = await requests.get();
      let res = [];
      reqData.forEach(element => {
        res.push({
          toApprove: element.data().toApprove,
          userName: element.data().userName,
          cityName: element.data().cityName,
          companyName: element.data().companyName,
          rejected: element.data().rejected,
          requestID: element.id
        });
      });
      return res;
    } else if (userData.data().role === "admin") {
      const requests = db.collection("approvals");
      let reqData = await requests.get();
      let res = [];
      reqData.forEach(element => {
        res.push({
          toApprove: element.data().toApprove,
          userName: element.data().userName,
          cityName: element.data().cityName,
          companyName: element.data().companyName,
          rejected: element.data().rejected,
          requestID: element.id
        });
      });
      return res;
    }
  }
);
