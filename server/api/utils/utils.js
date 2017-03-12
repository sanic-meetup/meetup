exports.statcodes = {
  _400: JSON.stringify({response:"bad request"}),
  _401: JSON.stringify({response:"unauthorized"}),
  _409: JSON.stringify({response:"new user not created"}),
  _500: JSON.stringify({response:"server error"})
};

//strips the user objec returned by db to somthing not containing
//sensitive data
exports.docstrip = function(doc) {
  var new_doc = {
    username: doc.username,
    email: doc.email,
    status: doc.status,
    location: doc.location
  };
  return JSON.stringify(new_doc);
};

exports.stringify = function(obj) {
  return JSON.stringify(obj);
};
